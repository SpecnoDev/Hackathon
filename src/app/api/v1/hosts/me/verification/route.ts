import { NextRequest, NextResponse } from 'next/server';
import { API_ERROR_CODES, HTTP_STATUS, isMockAuthEnabled } from '@/core/constants';
import { requireHost } from '@/core/guards';
import { verifyHostIdentity } from '@/core/services';
import { ApiError, fail, ok } from '@/core/utils';
import { hostVerificationSchema } from '@/shared/dto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Same 404 envelope as a missing route, and ahead of the guard so an unauthenticated
    // probe learns nothing either — off by default, so this never becomes an oracle.
    if (!isMockAuthEnabled()) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Not found');

    const hostId = await requireHost();
    hostVerificationSchema.parse(await request.json());

    const result = await verifyHostIdentity(hostId);
    console.info('[auth] mock grant', { hostId, mock: 'identity-tier' });

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
