import { NextResponse } from 'next/server';
import { requireHost } from '@/core/guards';
import { deleteHostOffering, setHostOfferingStatus, updateHostOfferingFields } from '@/core/services';
import { fail, ok } from '@/core/utils';
import { offeringPatchSchema } from '@/shared/dto';
import { getOfferingDetail } from '@/features/demand/services';

export const runtime = 'nodejs';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  const { id } = await params;
  const data = await getOfferingDetail(id);

  if (!data) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Offering not found.' } },
      { status: 404 },
    );
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const hostId = await requireHost();
    const { id } = await params;
    const patch = offeringPatchSchema.parse(await request.json());

    const result =
      'status' in patch
        ? await setHostOfferingStatus(hostId, id, patch.status)
        : await updateHostOfferingFields(hostId, id, patch);

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams): Promise<NextResponse> {
  try {
    const hostId = await requireHost();
    const { id } = await params;

    return ok(await deleteHostOffering(hostId, id));
  } catch (error) {
    return fail(error);
  }
}
