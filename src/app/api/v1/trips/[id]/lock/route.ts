import { NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { lockTrip } from '@/features/demand/services';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const { id: tripId } = await params;

    const locked = await lockTrip(travellerId, tripId);
    if (!locked) {
      return NextResponse.json(
        { error: { code: 'NOT_ORGANISER', message: 'Only the trip organiser can lock it.' } },
        { status: 403 },
      );
    }

    return ok({ locked: true });
  } catch (error) {
    return fail(error);
  }
}
