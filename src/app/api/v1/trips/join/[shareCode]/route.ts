import { NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { joinTrip } from '@/features/demand/services';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ shareCode: string }> },
): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const { shareCode } = await params;

    const trip = await joinTrip(travellerId, shareCode);
    if (!trip) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'No open trip with that code.' } },
        { status: 404 },
      );
    }

    return ok(trip);
  } catch (error) {
    return fail(error);
  }
}
