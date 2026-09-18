import { NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { voteOnBlock } from '@/features/demand/services';
import { voteBlockSchema } from '@/shared/dto';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const { id: blockId } = await params;
    const input = voteBlockSchema.parse(await request.json());

    const voted = await voteOnBlock(travellerId, blockId, input);
    if (!voted) {
      return NextResponse.json(
        { error: { code: 'NOT_A_MEMBER', message: 'Not a member of this trip.' } },
        { status: 403 },
      );
    }

    return ok({ voted: true });
  } catch (error) {
    return fail(error);
  }
}
