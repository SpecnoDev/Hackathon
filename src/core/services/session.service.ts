import { createHmac } from 'node:crypto';
import { cookies } from 'next/headers';
import {
  ENV_KEYS,
  HOST_ONBOARDED_CLAIM,
  HOST_SESSION_COOKIE,
  HOST_SESSION_TTL_SECONDS,
  MS_PER_SECOND,
  SESSION_TOKEN_SEPARATOR,
  isProduction,
  requireEnv,
} from '../constants';
import { isEqualSecret } from '../utils';

const sign = (payload: string): string =>
  createHmac('sha256', requireEnv(ENV_KEYS.sessionSecret)).update(payload).digest('base64url');

export const issueHostSession = async (hostId: string, { onboarded }: { onboarded: boolean }): Promise<void> => {
  const payload = [
    hostId,
    Date.now() + HOST_SESSION_TTL_SECONDS * MS_PER_SECOND,
    onboarded ? HOST_ONBOARDED_CLAIM.complete : HOST_ONBOARDED_CLAIM.pending,
  ].join(SESSION_TOKEN_SEPARATOR);

  (await cookies()).set(HOST_SESSION_COOKIE, [payload, sign(payload)].join(SESSION_TOKEN_SEPARATOR), {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction(),
    path: '/',
    maxAge: HOST_SESSION_TTL_SECONDS,
  });
};

export const readHostSession = async (): Promise<string | null> => {
  const token = (await cookies()).get(HOST_SESSION_COOKIE)?.value;
  const [hostId, expiresAt, onboarded, signature] = token?.split(SESSION_TOKEN_SEPARATOR) ?? [];
  if (!hostId || !expiresAt || !onboarded || !signature) return null;

  const isAuthentic = isEqualSecret(
    signature,
    sign([hostId, expiresAt, onboarded].join(SESSION_TOKEN_SEPARATOR)),
  );

  return isAuthentic && Number(expiresAt) > Date.now() ? hostId : null;
};

export const clearHostSession = async (): Promise<void> => {
  (await cookies()).delete(HOST_SESSION_COOKIE);
};
