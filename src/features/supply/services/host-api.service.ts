import { HTTP_STATUS } from '@/core/constants';
import { HOST_API_TIMEOUT_MS } from '../constants';
import type { OutboxEntry } from '../interfaces';

const JSON_CONTENT_TYPE = { 'content-type': 'application/json' } as const;

export interface HostApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
  errorCode?: string;
}

/**
 * Same-origin fetch: the server reads its session from the `host_session` cookie automatically.
 * F4: bounded by HOST_API_TIMEOUT_MS — plain `fetch` has no timeout of its own, so a stalled network
 * (or a hung server) would otherwise wait forever. `AbortSignal.timeout` throws a `TimeoutError`
 * (a `DOMException`), caught below and folded into the same `status: 0` shape as an offline/network
 * failure, which `send()` already maps to the RETRY outcome — a timeout is just another form of
 * "couldn't reach the server", not a new case callers need to know about.
 */
const request = async <T = unknown>(method: string, path: string, body?: unknown): Promise<HostApiResponse<T>> => {
  try {
    const response = await fetch(path, {
      method,
      headers: JSON_CONTENT_TYPE,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(HOST_API_TIMEOUT_MS),
    });
    const json = (await response.json().catch(() => undefined)) as { data?: T; error?: { code?: string } } | undefined;
    return { ok: response.ok, status: response.status, data: json?.data, errorCode: json?.error?.code };
  } catch {
    return { ok: false, status: 0 };
  }
};

export type HostApiOutcome = 'SYNCED' | 'RETRY' | 'DROPPED';

export interface HostApiResult<T = unknown> {
  outcome: HostApiOutcome;
  data?: T;
}

/** 408 has no entry in the shared HTTP_STATUS map (core/constants belongs to another agent's tree); named here so it isn't a bare literal. */
const REQUEST_TIMEOUT_STATUS = 408;
/** The two 4xx statuses worth retrying: the request may simply not have arrived in time, or arrive again once the rate limit clears. */
const RETRYABLE_CLIENT_STATUSES: readonly number[] = [REQUEST_TIMEOUT_STATUS, HTTP_STATUS.tooManyRequests];

/**
 * The outbox's single sender. A write is safe to drop for good when it landed (SYNCED) or when the
 * server rejected it outright (DROPPED: any 4xx but a timeout or a rate limit — retrying a bad
 * request, an expired session or a missing record would just fail the same way again). A network
 * error, a 5xx, a 408 or a 429 is a RETRY, which the caller queues.
 */
export const hostApiService = {
  request,

  async send<T = unknown>(entry: Pick<OutboxEntry, 'method' | 'path' | 'body'>): Promise<HostApiResult<T>> {
    const response = await request<T>(entry.method, entry.path, entry.body);
    if (response.ok) return { outcome: 'SYNCED', data: response.data };
    if (response.status === 0 || response.status >= HTTP_STATUS.serverError || RETRYABLE_CLIENT_STATUSES.includes(response.status)) {
      return { outcome: 'RETRY' };
    }
    return { outcome: 'DROPPED' };
  },
};
