import { NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { cancelBooking } from '@/features/demand/services';
import { cancelBookingSchema } from '@/shared/dto';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const { id: bookingId } = await params;
    const input = cancelBookingSchema.parse(await request.json().catch(() => ({})));

    const booking = await cancelBooking(travellerId, bookingId, input);
    if (!booking) {
      return NextResponse.json(
        { error: { code: 'NOT_CANCELLABLE', message: 'Booking not found or already finished.' } },
        { status: 403 },
      );
    }

    return ok(booking);
  } catch (error) {
    return fail(error);
  }
}
