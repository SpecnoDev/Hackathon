import { NextRequest, NextResponse } from 'next/server';
import {
  RETURN_TO_PARAM,
  ROLE_HOME_ROUTE,
  ROUTES,
  SIGNED_IN_COOKIE,
  SIGNED_IN_COOKIE_MAX_AGE_SECONDS,
  USER_ROLES,
  safeReturnPath,
} from '@/core/constants';
import { createSupabaseServerClient, getCurrentUser } from '@/core/services';
import { SIGN_IN_LINK_TOKEN_PARAM, SIGN_IN_LINK_TYPES, SIGN_IN_LINK_TYPE_PARAM } from '@/features/auth/constants';

export const dynamic = 'force-dynamic';

const AUTH_CODE_PARAM = 'code';

/**
 * Where signing in lands, by any route. Our own emailed link carries the token hash, verified here
 * so the session cookies land on this response; a link Supabase sent itself arrives with a one-time
 * code to trade for a session; typing the emailed code into the form has already done that in the
 * browser. Either way the role is only known to the database, so the redirect is decided here.
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get(AUTH_CODE_PARAM);
  const tokenHash = searchParams.get(SIGN_IN_LINK_TOKEN_PARAM);
  const linkType = SIGN_IN_LINK_TYPES.find((type) => type === searchParams.get(SIGN_IN_LINK_TYPE_PARAM));
  if (code || (tokenHash && linkType)) {
    const supabase = await createSupabaseServerClient();
    if (code) await supabase.auth.exchangeCodeForSession(code);
    else if (tokenHash && linkType) await supabase.auth.verifyOtp({ token_hash: tokenHash, type: linkType });
  }

  const user = await getCurrentUser();
  const returnTo = safeReturnPath(request.nextUrl.searchParams.get(RETURN_TO_PARAM));

  const response = NextResponse.redirect(
    new URL(user ? (returnTo ?? ROLE_HOME_ROUTE[user.role]) : ROUTES.login, request.url),
  );
  if (user?.role === USER_ROLES.traveller)
    response.cookies.set(SIGNED_IN_COOKIE, user.traveller.name, {
      maxAge: SIGNED_IN_COOKIE_MAX_AGE_SECONDS,
      path: '/',
    });

  return response;
};
