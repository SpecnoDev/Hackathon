import { NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { checkoutTrip } from '@/features/demand/services';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const { id: tripId } = await params;

    const result = await checkoutTrip(travellerId, tripId);
    if (!result) {
      return NextResponse.json(
        { error: { code: 'NOT_READY', message: 'Trip must be locked and you must be a member to check out.' } },
        { status: 403 },
      );
    }

    return ok(result);
  } catch (error) {
    return fail(error);
  }
}
