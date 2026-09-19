import { NextResponse } from 'next/server';
import { requireHost } from '@/core/guards';
import { listHostBookings } from '@/core/services';
import { fail, ok } from '@/core/utils';

export const runtime = 'nodejs';

export async function GET(): Promise<NextResponse> {
  try {
    const hostId = await requireHost();

    return ok(await listHostBookings(hostId));
  } catch (error) {
    return fail(error);
  }
}
