import { NextRequest, NextResponse } from 'next/server';
import { API_ERROR_CODES, HTTP_STATUS, MOCK_OTP_REJECTED_CODE, isMockAuthEnabled } from '@/core/constants';
import { findOrCreateHostByPhone, issueHostSession } from '@/core/services';
import { ApiError, fail, ok } from '@/core/utils';
import { otpVerifySchema } from '@/shared/dto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Same 404 envelope as a missing route — off by default, so this never becomes an oracle.
    if (!isMockAuthEnabled()) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Not found');

    const { phone, code } = otpVerifySchema.parse(await request.json());
    if (code === MOCK_OTP_REJECTED_CODE) {
      throw new ApiError(API_ERROR_CODES.otpInvalid, HTTP_STATUS.unauthorized, 'Incorrect code');
    }

    const host = await findOrCreateHostByPhone(phone);
    // The cookie claim is what the middleware reads; the client-side registration flow is the onboarding.
    await issueHostSession(host.id, { onboarded: true });
    console.info('[auth] mock grant', { hostId: host.id, mock: 'session' });

    return ok({ id: host.id });
  } catch (error) {
    return fail(error);
  }
}
