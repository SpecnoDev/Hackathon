import { ENV_KEYS, optionalEnv, requireEnv } from '@/core/constants';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
/** Resend's answer for a sender on a domain the account has not verified. */
const HTTP_FORBIDDEN = 403;
const DEFAULT_FROM = 'Hosted <no-reply@hosted.com>';
/**
 * Resend's shared test sender: the one retry when the configured sender's domain is not verified in
 * the account, so a sign-in never dies on a DNS record. It delivers only to the account's own address.
 */
const TEST_FROM = 'Hosted <onboarding@resend.dev>';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const post = (from: string, message: EmailMessage): Promise<Response> =>
  fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${requireEnv(ENV_KEYS.resendApiKey)}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, ...message }),
  });

/** One provider, one REST call, no SDK: it keeps the dependency list where it is. Never logs the message. */
export const sendEmail = async (message: EmailMessage): Promise<void> => {
  const from = optionalEnv(ENV_KEYS.resendFrom) ?? DEFAULT_FROM;
  let response = await post(from, message);
  if (response.status === HTTP_FORBIDDEN && from !== TEST_FROM) response = await post(TEST_FROM, message);
  if (!response.ok) throw new Error(`Email provider answered ${response.status}`);
};
