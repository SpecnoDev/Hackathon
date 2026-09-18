import { NextResponse } from 'next/server';
import { clearHostSession } from '@/core/services';
import { fail, ok } from '@/core/utils';

export const runtime = 'nodejs';

export async function DELETE(): Promise<NextResponse> {
  try {
    await clearHostSession();

    return ok({ signedOut: true });
  } catch (error) {
    return fail(error);
  }
}
