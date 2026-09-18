import { ENV_KEYS, optionalEnv } from './env.constant';
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
// 4, not a rounder number: matches the client's OtpInput (features/supply/constants/host-limits.constant.ts
// OTP_LENGTH) — the mock host flow has no server-generated code to size against, so this is the contract.
// Distinct from OTP_CODE_LENGTH, which sizes the email sign-in code Supabase sends.
export const HOST_OTP_CODE_LENGTH = 4;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_TTL_MINUTES = 10;
export const OTP_TTL_MS = OTP_TTL_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND;
export const OTP_RESEND_COOLDOWN_MS = SECONDS_PER_MINUTE * MS_PER_SECOND;
/** Any other OTP_CODE_LENGTH-digit code passes the mock verify; this one demos the error state. */
export const MOCK_OTP_REJECTED_CODE = '0000';

/**
 * Hackathon-only bypass: when true, `/auth/host/verify` and `/hosts/me/verification` skip real
 * verification and hand back a mock session / identity tier so the demo works without a live
 * OTP or KYC provider. Read at call time (not cached) so flipping the env var takes effect on
 * the next request; exact string match, default deny. Removal target: after judging, 2026-09-19.
 * This gates the mock endpoints only — it is NOT a substitute for OTP rate limiting.
 */
export const isMockAuthEnabled = (): boolean => optionalEnv(ENV_KEYS.allowMockAuth) === 'true';

export const otpMessage = (code: string): string =>
  `${code} is your sign-in code. It expires in ${OTP_TTL_MINUTES} minutes. Never share it.`;
