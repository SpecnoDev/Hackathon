import { NextRequest, NextResponse } from 'next/server';
import { ROLE_HOME_ROUTE, ROUTES } from '@/core/constants';
import { getCurrentUser } from '@/core/services';

/**
 * The browser holds the Supabase session but not the role, which only the database knows.
 * Signing in lands here so the server can send an admin to the backoffice and everyone else
 * to the traveller app.
 */
export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const user = await getCurrentUser();

  return NextResponse.redirect(new URL(user ? ROLE_HOME_ROUTE[user.role] : ROUTES.login, request.url));
};
