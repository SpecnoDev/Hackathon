import { NextRequest, NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { createTrip, listOpenTrips } from '@/features/demand/services';
import { createTripSchema } from '@/shared/dto';

export async function GET(): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const data = await listOpenTrips(travellerId);
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const input = createTripSchema.parse(await request.json());
    const data = await createTrip(travellerId, input);
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}
