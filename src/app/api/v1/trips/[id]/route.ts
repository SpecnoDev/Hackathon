import { NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { getTripDetail } from '@/features/demand/services';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const { id: tripId } = await params;

    const trip = await getTripDetail(travellerId, tripId);
    if (!trip) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'No trip with that id, or you are not a member.' } },
        { status: 404 },
      );
    }

    return ok(trip);
  } catch (error) {
    return fail(error);
  }
}
