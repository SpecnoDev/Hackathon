import { NextResponse } from 'next/server';
import { requireTraveller } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { listSavedOfferingIds } from '@/features/demand/services';

export async function GET(): Promise<NextResponse> {
  try {
    const travellerId = await requireTraveller();
    const data = await listSavedOfferingIds(travellerId);
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}
