import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/core/guards';
import { fail, ok } from '@/core/utils';
import { adminActionQuerySchema } from '@/shared/dto';
import { listAdminActions } from '@/features/admin/services';

export const runtime = 'nodejs';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await requireAdmin();
    const query = adminActionQuerySchema.parse(Object.fromEntries(request.nextUrl.searchParams));

    return ok(await listAdminActions(query));
  } catch (error) {
    return fail(error);
  }
}
