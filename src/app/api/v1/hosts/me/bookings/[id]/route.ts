import { NextResponse } from 'next/server';
import { requireHost } from '@/core/guards';
import { updateHostBookingStatus } from '@/core/services';
import { fail, ok } from '@/core/utils';
import { hostBookingPatchSchema } from '@/shared/dto';

export const runtime = 'nodejs';

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const hostId = await requireHost();
    const { id } = await params;
    const patch = hostBookingPatchSchema.parse(await request.json());

    return ok(await updateHostBookingStatus(hostId, id, patch));
  } catch (error) {
    return fail(error);
  }
}
