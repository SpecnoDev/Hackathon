import { NextRequest, NextResponse } from 'next/server';
import { PLACEHOLDER_TRAVELLER_ID } from '@/features/demand/constants';
import { addTripBlock } from '@/features/demand/services';
import { createTripBlockSchema } from '@/shared/dto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id: tripId } = await params;
  const parsed = createTripBlockSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_BODY', message: 'Invalid trip block payload.' } },
      { status: 400 },
    );
  }

  const block = await addTripBlock(PLACEHOLDER_TRAVELLER_ID, tripId, parsed.data);

  if (!block) {
    return NextResponse.json(
      { error: { code: 'NOT_A_MEMBER', message: 'Not a member of this trip.' } },
      { status: 403 },
    );
  }

  return NextResponse.json({ data: block });
}
