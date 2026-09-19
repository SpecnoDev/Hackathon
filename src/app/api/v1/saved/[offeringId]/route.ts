import { NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { toggleSavedListing } from '@/features/demand/services';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ offeringId: string }> },
): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const { offeringId } = await params;

    const saved = await toggleSavedListing(travellerId, offeringId);
    return ok({ saved });
  } catch (error) {
    return fail(error);
  }
}
