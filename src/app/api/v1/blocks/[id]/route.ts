import { NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { removeTripBlock } from '@/features/demand/services';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const { id: blockId } = await params;

    const removed = await removeTripBlock(travellerId, blockId);
    if (!removed) {
      return NextResponse.json(
        { error: { code: 'NOT_REMOVABLE', message: 'Block not found, trip is locked, or you are not a member.' } },
        { status: 403 },
      );
    }

    return ok({ removed: true });
  } catch (error) {
    return fail(error);
  }
}
