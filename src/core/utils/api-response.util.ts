import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { API_ERROR_CODES, GENERIC_ERROR_MESSAGE, HTTP_STATUS } from '../constants';

export class ApiError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

const errorResponse = (code: string, message: string, status: number): NextResponse =>
  NextResponse.json({ error: { code, message } }, { status });

export const ok = <T>(data: T, status: number = HTTP_STATUS.ok): NextResponse => NextResponse.json({ data }, { status });

/** The only place an exception becomes a response, so no Prisma or stack detail can reach a client. */
export const fail = (error: unknown): NextResponse => {
  if (error instanceof ApiError) return errorResponse(error.code, error.message, error.status);

  if (error instanceof ZodError) {
    const message = error.issues.map(({ path, message }) => `${path.join('.') || 'body'}: ${message}`).join('; ');
    return errorResponse(API_ERROR_CODES.validationFailed, message, HTTP_STATUS.unprocessable);
  }

  console.error('[api] unhandled error', error);
  return errorResponse(API_ERROR_CODES.internal, GENERIC_ERROR_MESSAGE, HTTP_STATUS.serverError);
};
