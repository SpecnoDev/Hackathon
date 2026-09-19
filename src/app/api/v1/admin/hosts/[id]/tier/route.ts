import { NextResponse } from 'next/server';
import { requireAdmin } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { verificationTierPatchSchema } from '@/shared/dto';
import { setVerificationTier } from '@/features/admin/services';

export const runtime = 'nodejs';

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const actorEmail = await requireAdmin();
    const { id } = await params;
    const { tier, reason } = verificationTierPatchSchema.parse(await request.json());

    return ok(await setVerificationTier(id, tier, reason, actorEmail));
  } catch (error) {
    return fail(error);
  }
}
