import { NextResponse } from 'next/server';
import { HTTP_STATUS } from '@/core/constants';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { createBooking, listTravellerBookings } from '@/features/demand/services';
import { createBookingSchema } from '@/shared/dto';

/**
 * TECH_STACK.md scopes this route by `?role=host|traveller`. Only the traveller side is built
 * here — the host side needs `requireHost` wired to real host session data, Marlon's area.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const role = new URL(request.url).searchParams.get('role');
    if (role === 'host') {
      return NextResponse.json(
        { error: { code: 'NOT_IMPLEMENTED', message: 'Host bookings are not wired up yet.' } },
        { status: 501 },
      );
    }

    const travellerId = await requireTraveller();
    const data = await listTravellerBookings(travellerId);
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}

/** A direct booking of one offering, minted on the client so a replayed submit returns the same booking. */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const input = createBookingSchema.parse(await request.json());

    const booking = await createBooking(travellerId, input);
    if (!booking) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'That listing is not open for booking.' } }, { status: HTTP_STATUS.notFound });
    }

    return ok(booking, HTTP_STATUS.created);
  } catch (error) {
    return fail(error);
  }
}
