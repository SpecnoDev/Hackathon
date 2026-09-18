import { NextRequest, NextResponse } from 'next/server';
import { PLACEHOLDER_TRAVELLER_ID } from '@/features/demand/constants';
import { createTrip, listOpenTrips } from '@/features/demand/services';
import { createTripSchema } from '@/shared/dto';

export async function GET(): Promise<NextResponse> {
  const data = await listOpenTrips(PLACEHOLDER_TRAVELLER_ID);
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const parsed = createTripSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid trip payload.' } },
      { status: 400 },
    );
  }

  const data = await createTrip(PLACEHOLDER_TRAVELLER_ID, parsed.data);
  return NextResponse.json({ data });
}
