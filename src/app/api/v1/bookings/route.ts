import { NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { listTravellerBookings } from '@/features/demand/services';

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
