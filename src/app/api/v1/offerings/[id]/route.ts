import { NextResponse } from 'next/server';
import { getOfferingDetail } from '@/features/demand/services';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  const data = await getOfferingDetail(id);

  if (!data) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Offering not found.' } },
      { status: 404 },
    );
  }

  return NextResponse.json({ data });
}
