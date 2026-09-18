import { NextRequest, NextResponse } from 'next/server';
import { HTTP_STATUS } from '@/core/constants';
import { requireService } from '@/core/guards';
import { upsertHostFromIntake } from '@/core/services';
import { fail, ok } from '@/core/utils';
import { hostIntakeSchema } from '@/shared/dto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    requireService(request);
    const intake = hostIntakeSchema.parse(await request.json());

    return ok(await upsertHostFromIntake(intake), HTTP_STATUS.created);
  } catch (error) {
    return fail(error);
  }
}
