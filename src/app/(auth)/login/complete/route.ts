import { NextRequest, NextResponse } from 'next/server';
import { RETURN_TO_PARAM, ROLE_HOME_ROUTE, ROUTES, safeReturnPath } from '@/core/constants';
import { createSupabaseServerClient, getCurrentUser } from '@/core/services';

export const dynamic = 'force-dynamic';

const AUTH_CODE_PARAM = 'code';

/**
 * Where signing in lands, by either route. A link emailed by Supabase arrives with a one-time
 * code that has to be traded for a session before anything can read it; typing the emailed code
 * into the form has already done that in the browser. Either way the role is only known to the
 * database, so the redirect is decided here rather than client-side.
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const code = request.nextUrl.searchParams.get(AUTH_CODE_PARAM);
  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const user = await getCurrentUser();
  const returnTo = safeReturnPath(request.nextUrl.searchParams.get(RETURN_TO_PARAM));

  return NextResponse.redirect(new URL(user ? (returnTo ?? ROLE_HOME_ROUTE[user.role]) : ROUTES.login, request.url));
};
