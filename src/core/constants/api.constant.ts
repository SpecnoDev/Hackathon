export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  unauthorized: 401,
  notFound: 404,
  unprocessable: 422,
  tooManyRequests: 429,
  serverError: 500,
} as const;

export const API_ERROR_CODES = {
  unauthorized: 'UNAUTHORIZED',
  notFound: 'NOT_FOUND',
  validationFailed: 'VALIDATION_FAILED',
  otpInvalid: 'OTP_INVALID',
  otpExpired: 'OTP_EXPIRED',
  otpAttemptsExceeded: 'OTP_ATTEMPTS_EXCEEDED',
  otpResendTooSoon: 'OTP_RESEND_TOO_SOON',
  internal: 'INTERNAL_ERROR',
} as const;

export const AUTHORIZATION_HEADER = 'authorization';
export const BEARER_PREFIX = 'Bearer ';

export const GENERIC_ERROR_MESSAGE = 'Something went wrong';
