import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/core/constants';
import { findActiveHostId, issueHostSession } from '@/core/services';
import { readHostLink } from '@/features/auth/services';

/**
 * The WhatsApp handoff: the bot has already proven the host owns their number and taken them
 * through onboarding, so opening this link is both the sign-in and the end of signing up. They
 * land in the app with full access, never back on a join screen. A forged link, an expired one
 * and one belonging to a host who is off the platform all fall back to the sign-in page, and the
 * page never says which — a suspended host learns why from their operator, not from a URL.
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> => {
  const { token } = await params;
  const linkedHostId = readHostLink(token);
  const hostId = linkedHostId && (await findActiveHostId(linkedHostId));

  if (!hostId) return NextResponse.redirect(new URL(ROUTES.login, request.url));

  await issueHostSession(hostId, { onboarded: true });

  return NextResponse.redirect(new URL(ROUTES.hostProfile, request.url));
};
