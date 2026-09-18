import { NextRequest, NextResponse } from 'next/server';
import { offeringListQuerySchema } from '@/shared/dto';
import { listLiveOfferings } from '@/features/demand/services';

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
