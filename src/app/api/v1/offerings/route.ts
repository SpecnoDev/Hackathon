import { NextRequest, NextResponse } from 'next/server';
import { HTTP_STATUS } from '@/core/constants';
import { requireHost } from '@/core/guards';
import { createHostOffering } from '@/core/services';
import { fail, ok } from '@/core/utils';
import { offeringListQuerySchema, offeringWriteSchema } from '@/shared/dto';
import { listLiveOfferings } from '@/features/demand/services';

export const runtime = 'nodejs';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const parsed = offeringListQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: 'INVALID_QUERY', message: 'Invalid query parameters.' } },
      { status: 400 },
    );
  }

  const data = await listLiveOfferings(parsed.data);
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const hostId = await requireHost();
    const input = offeringWriteSchema.parse(await request.json());

    return ok(await createHostOffering(hostId, input), HTTP_STATUS.created);
  } catch (error) {
    return fail(error);
  }
}
