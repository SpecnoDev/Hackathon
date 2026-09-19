import { NextResponse } from 'next/server';
import { requireHost } from '@/core/guards';
import { listHostPayouts } from '@/core/services';
import { fail, ok } from '@/core/utils';

export const runtime = 'nodejs';

export async function GET(): Promise<NextResponse> {
  try {
    const hostId = await requireHost();

    return ok(await listHostPayouts(hostId));
  } catch (error) {
    return fail(error);
  }
}
