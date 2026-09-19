import { NextRequest, NextResponse } from 'next/server';
import { requireHost } from '@/core/guards';
import { findHostProfile, updateHostProfile } from '@/core/services';
import { fail, ok } from '@/core/utils';
import { hostProfilePatchSchema } from '@/shared/dto';

export const runtime = 'nodejs';

export async function GET(): Promise<NextResponse> {
  try {
    const hostId = await requireHost();

    return ok(await findHostProfile(hostId));
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const hostId = await requireHost();
    const patch = hostProfilePatchSchema.parse(await request.json());

    return ok(await updateHostProfile(hostId, patch));
  } catch (error) {
    return fail(error);
  }
}
