import { HOURS_PER_DAY, MINUTES_PER_HOUR, MS_PER_SECOND, SECONDS_PER_MINUTE } from './time.constant';

export const USER_ROLES = { admin: 'admin', host: 'host', traveller: 'traveller' } as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Admins are an allowlist of Supabase account emails rather than a table, so the backoffice
 * needs no schema change and no invite flow for the demo. Comma separated, case insensitive.
 */
export const adminEmails = (raw: string | undefined): readonly string[] =>
  (raw ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const HOST_SESSION_COOKIE = 'host_session';
export const HOST_SESSION_TTL_SECONDS = 7 * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE;
export const SESSION_TOKEN_SEPARATOR = '.';
/** Carried inside the signed host cookie so the edge can gate onboarding without a database read. */
export const HOST_ONBOARDED_CLAIM = { complete: '1', pending: '0' } as const;

/**
 * WhatsApp has already proven the host owns their number by the time the bot finishes, so the
 * sign-in link stands in for an OTP. Kept short because the link itself is the credential.
 */
export const MAGIC_LINK_TTL_MINUTES = 30;
export const MAGIC_LINK_TTL_MS = MAGIC_LINK_TTL_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND;

export const OTP_CODE_LENGTH = 6;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_TTL_MINUTES = 10;
export const OTP_TTL_MS = OTP_TTL_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND;
export const OTP_RESEND_COOLDOWN_MS = SECONDS_PER_MINUTE * MS_PER_SECOND;

export const otpMessage = (code: string): string =>
  `${code} is your sign-in code. It expires in ${OTP_TTL_MINUTES} minutes. Never share it.`;
