import { createHmac, timingSafeEqual } from 'node:crypto';
import { SIGNATURE_PREFIX } from '../constants';

/**
 * Verifies Meta's X-Hub-Signature-256 against the exact bytes received.
 * `rawBody` must be the unparsed request text — re-serialising the JSON breaks the HMAC.
 */
export const isValidWebhookSignature = (rawBody: string, header: string | null, appSecret: string): boolean => {
  if (!header?.startsWith(SIGNATURE_PREFIX)) return false;

  const expected = createHmac('sha256', appSecret).update(rawBody).digest();
  const received = Buffer.from(header.slice(SIGNATURE_PREFIX.length), 'hex');

  return expected.length === received.length && timingSafeEqual(expected, received);
};
