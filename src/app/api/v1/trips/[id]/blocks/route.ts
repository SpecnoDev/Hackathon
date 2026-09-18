import { NextRequest, NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { addTripBlock } from '@/features/demand/services';
import { createTripBlockSchema } from '@/shared/dto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const { id: tripId } = await params;
    const input = createTripBlockSchema.parse(await request.json());

    const block = await addTripBlock(travellerId, tripId, input);
    if (!block) {
      return NextResponse.json(
        { error: { code: 'NOT_A_MEMBER', message: 'Not a member of this trip.' } },
        { status: 403 },
      );
    }

    return ok(block);
  } catch (error) {
    return fail(error);
  }
}
