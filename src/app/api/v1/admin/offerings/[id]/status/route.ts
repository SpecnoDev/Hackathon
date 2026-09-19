import { NextResponse } from 'next/server';
import { requireAdmin } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { adminOfferingStatusPatchSchema } from '@/shared/dto';
import { setOfferingStatus } from '@/features/admin/services';

export const runtime = 'nodejs';

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const actorEmail = await requireAdmin();
    const { id } = await params;
    const { status, reason } = adminOfferingStatusPatchSchema.parse(await request.json());

    return ok(await setOfferingStatus(id, status, reason, actorEmail));
  } catch (error) {
    return fail(error);
  }
}
