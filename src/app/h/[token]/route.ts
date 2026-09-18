import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/core/constants';
import { issueHostSession, prisma } from '@/core/services';
import { readHostLink } from '@/features/auth/services';

/**
 * The WhatsApp handoff: the bot has already proven the host owns their number, so opening this
 * link is the sign-in. A forged or expired link falls back to the sign-in page without saying
 * which it was.
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> => {
  const { token } = await params;
  const hostId = readHostLink(token);
  const host = hostId
    ? await prisma.host.findUnique({
        where: { id: hostId },
        select: { id: true, fullName: true, serviceArea: true },
      })
    : null;

  if (!host) return NextResponse.redirect(new URL(ROUTES.login, request.url));

  const onboarded = Boolean(host.fullName && host.serviceArea);
  await issueHostSession(host.id, { onboarded });

  return NextResponse.redirect(
    new URL(onboarded ? ROUTES.host : ROUTES.hostOnboarding, request.url),
  );
};
