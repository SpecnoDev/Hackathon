import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/core/constants';
import { issueHostSession, prisma } from '@/core/services';
import { readHostLink } from '@/features/auth/services';

/**
 * The WhatsApp handoff: the bot has already proven the host owns their number and taken them
 * through onboarding, so opening this link is both the sign-in and the end of signing up. They
 * land in the app with full access, never back on a join screen. A forged or expired link falls
 * back to the sign-in page without saying which it was.
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> => {
  const { token } = await params;
  const hostId = readHostLink(token);
  const host = hostId ? await prisma.host.findUnique({ where: { id: hostId }, select: { id: true } }) : null;

  if (!host) return NextResponse.redirect(new URL(ROUTES.login, request.url));

  await issueHostSession(host.id, { onboarded: true });

  return NextResponse.redirect(new URL(ROUTES.host, request.url));
};
