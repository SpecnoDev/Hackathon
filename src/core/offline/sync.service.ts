import { LOCAL_STORES, OUTBOX_MAX_ATTEMPTS } from '@/core/constants';
import { LocalRecord, allLocal, deleteLocal, getLocal, putLocal } from './local-db.service';

export interface OutboxEntry extends LocalRecord {
  readonly method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  readonly path: string;
  readonly body: unknown;
  readonly queuedAt: number;
  readonly attempts: number;
}

const JSON_HEADERS = { 'content-type': 'application/json' } as const;

/** A 4xx will never succeed on replay; these three are the ones that will. */
const RETRYABLE_STATUSES = new Set([408, 425, 429]);

const listeners = new Set<(pending: number) => void>();

const notify = async (): Promise<void> => {
  const { length } = await allLocal<OutboxEntry>(LOCAL_STORES.outbox);
  listeners.forEach((listener) => listener(length));
};

const send = async ({ path, method, body }: OutboxEntry): Promise<'sent' | 'retry'> => {
  try {
    const response = await fetch(path, { method, headers: JSON_HEADERS, body: JSON.stringify(body) });

    return response.ok || !(response.status >= 500 || RETRYABLE_STATUSES.has(response.status))
      ? 'sent'
      : 'retry';
  } catch {
    return 'retry';
  }
};

/**
 * Strictly in order and stopping at the first entry that will not go through: a trip has to be
 * created before its blocks can be added, so skipping ahead past a failure would lose the block.
 */
const drain = async (): Promise<void> => {
  const queued = (await allLocal<OutboxEntry>(LOCAL_STORES.outbox)).sort((a, b) => a.queuedAt - b.queuedAt);

  for (const entry of queued) {
    const attempts = entry.attempts + 1;

    if ((await send(entry)) === 'retry' && attempts < OUTBOX_MAX_ATTEMPTS) {
      await putLocal(LOCAL_STORES.outbox, { ...entry, attempts });
      break;
    }

    await deleteLocal(LOCAL_STORES.outbox, entry.id);
    await notify();
  }
};

let lastQueuedAt = 0;

/**
 * Two writes queued in the same millisecond would tie on queuedAt and replay in whatever order
 * IndexedDB returns them, which for a trip and its first block loses the block. Never tie.
 */
const nextQueuedAt = (): number => (lastQueuedAt = Math.max(Date.now(), lastQueuedAt + 1));

let draining: Promise<void> | undefined;

export const flushOutbox = (): Promise<void> =>
  (draining ??= drain().finally(() => {
    draining = undefined;
  }));

/**
 * The single way client code writes: the phone keeps the change first, the network second.
 * Resolves true when the write reached the API, false when it is still on the phone and the
 * UI has to say so.
 */
export const submitWrite = async (
  path: string,
  method: OutboxEntry['method'],
  body: unknown,
): Promise<boolean> => {
  const id = crypto.randomUUID();

  await putLocal<OutboxEntry>(LOCAL_STORES.outbox, {
    id,
    path,
    method,
    body,
    queuedAt: nextQueuedAt(),
    attempts: 0,
  });
  await notify();
  await flushOutbox();

  return !(await getLocal<OutboxEntry>(LOCAL_STORES.outbox, id));
};

export const watchOutbox = (listener: (pending: number) => void): (() => void) => {
  listeners.add(listener);
  void notify();

  return () => void listeners.delete(listener);
};

export const startSync = (): (() => void) => {
  const flush = () => void flushOutbox();

  window.addEventListener('online', flush);
  flush();

  return () => window.removeEventListener('online', flush);
};
