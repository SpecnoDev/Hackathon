import { NextResponse } from 'next/server';
import { requireHost } from '@/core/guards';
import { listHostOfferings } from '@/core/services';
import { fail, ok } from '@/core/utils';

export const runtime = 'nodejs';

export async function GET(): Promise<NextResponse> {
  try {
    const hostId = await requireHost();

    return ok(await listHostOfferings(hostId));
  } catch (error) {
    return fail(error);
  }
}
