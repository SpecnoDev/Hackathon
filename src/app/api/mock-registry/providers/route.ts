import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { ProviderProfileDto } from '@/features/onboarding/dto';
import { providerRegistryStore, StoredProfile } from '@/features/onboarding/services';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Stand-in for the real provider registry so the end-to-end flow is demoable before
 * that API exists. It is unauthenticated and in-memory — delete this route once
 * PROFILE_API_URL points somewhere real.
 */
export async function POST(request: NextRequest): Promise<NextResponse<{ reference: string }>> {
  const profile = (await request.json()) as ProviderProfileDto;
  const reference = `PRV-${randomUUID().slice(0, 8).toUpperCase()}`;

  providerRegistryStore.add({ ...profile, reference });

  return NextResponse.json({ reference });
}

export function GET(): NextResponse<readonly StoredProfile[]> {
  return NextResponse.json(providerRegistryStore.list());
}
