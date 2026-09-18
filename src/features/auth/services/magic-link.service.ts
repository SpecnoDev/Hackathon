import { createHmac } from 'node:crypto';
import {
  ENV_KEYS,
  MAGIC_LINK_TTL_MS,
  ROUTES,
  SESSION_TOKEN_SEPARATOR,
  optionalEnv,
  requireEnv,
} from '@/core/constants';
import { isEqualSecret } from '@/core/utils';

const sign = (payload: string): string =>
  createHmac('sha256', requireEnv(ENV_KEYS.sessionSecret)).update(payload).digest('base64url');

const encode = (token: string): string => Buffer.from(token).toString('base64url');
const decode = (token: string): string => Buffer.from(token, 'base64url').toString('utf8');

/**
 * The link is the credential, so it carries its own expiry and signature instead of a database
 * row. That keeps the bot stateless and means a host can be signed in from a WhatsApp message
 * with no OTP to type. It is single-use only by being short-lived, which is the trade we accept
 * to avoid a table: anyone holding the URL within the window can open the session.
 */
export const issueHostLink = (hostId: string, origin?: string): string => {
  const payload = [hostId, Date.now() + MAGIC_LINK_TTL_MS].join(SESSION_TOKEN_SEPARATOR);
  const token = encode([payload, sign(payload)].join(SESSION_TOKEN_SEPARATOR));
  const base = origin ?? optionalEnv(ENV_KEYS.appUrl) ?? '';

  return `${base}${ROUTES.hostLink}/${token}`;
};

/** Returns the host id the link was minted for, or null when it is forged, malformed or expired. */
export const readHostLink = (token: string): string | null => {
  const [hostId, expiresAt, signature] = decode(token).split(SESSION_TOKEN_SEPARATOR);
  if (!hostId || !expiresAt || !signature) return null;

  const isAuthentic = isEqualSecret(
    signature,
    sign([hostId, expiresAt].join(SESSION_TOKEN_SEPARATOR)),
  );

  return isAuthentic && Number(expiresAt) > Date.now() ? hostId : null;
};
