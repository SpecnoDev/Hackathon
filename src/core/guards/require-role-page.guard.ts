import { redirect } from 'next/navigation';
import { cache } from 'react';
import { DEMO_ADMIN_EMAIL, ROLE_HOME_ROUTE, ROUTES, USER_ROLES, isMockAuthEnabled } from '../constants';
import { CurrentUser, getCurrentUser } from '../services';

/** Deduped so a layout, its page and a server action resolve the session once per request. */
export const currentUser = cache(getCurrentUser);

/**
 * Server-side enforcement, deliberately not only in middleware: middleware is a redirect
 * convenience and has been bypassable by a crafted header (CVE-2025-29927). These run inside
 * the render, so a request that skips middleware still cannot see another role's UI.
 */
const requireRole = async <R extends CurrentUser extends null ? never : NonNullable<CurrentUser>['role']>(
  role: R,
): Promise<Extract<NonNullable<CurrentUser>, { role: R }>> => {
  const user = await currentUser();
  if (!user) redirect(ROUTES.login);
  if (user.role !== role) redirect(ROLE_HOME_ROUTE[user.role]);

  return user as Extract<NonNullable<CurrentUser>, { role: R }>;
};

/**
 * Hackathon-only: with ALLOW_MOCK_AUTH set, /admin opens without a sign-in so the demo does not
 * detour through email. Actions taken this way are attributed to DEMO_ADMIN_EMAIL, not a person.
 * Removal target: after judging, 2026-09-19.
 */
export const requireAdminPage = async () => {
  const user = await currentUser();
  if (user?.role === USER_ROLES.admin) return user;
  if (isMockAuthEnabled()) return { role: USER_ROLES.admin, email: DEMO_ADMIN_EMAIL } as const;
  return requireRole(USER_ROLES.admin);
};
export const requireTravellerPage = () => requireRole(USER_ROLES.traveller);

/**
 * Browsing is public, so this never forces a sign-in. It exists to keep a signed-in host out
 * of the traveller tree, which is the leak the role split is there to prevent.
 */
export const forbidHostOnTravellerRoutes = async (): Promise<void> => {
  const user = await currentUser();
  if (user?.role === USER_ROLES.host) redirect(ROLE_HOME_ROUTE[USER_ROLES.host]);
};
