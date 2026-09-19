import { redirect } from 'next/navigation';
import { cache } from 'react';
import { DEMO_ADMIN_EMAIL, ROLE_HOME_ROUTE, ROUTES, USER_ROLES, isDemoBypassEnabled, isMockAuthEnabled } from '../constants';
import { CurrentUser, getCurrentUser, getDemoTraveller } from '../services';

/** Deduped so a layout, its page and a server action resolve the session once per request. */
export const currentUser = cache(getCurrentUser);

/**
 * Hackathon-only, same envelope as the middleware bypass (`ALLOW_DEMO_BYPASS`, gated
 * `!isProduction()`): resolves a sessionless traveller request to Jess Cronin's row, the same
 * identity `/api/v1/auth/demo/session` signs a real demo login in as. Cached so a layout, its
 * page and a server action inside one render share a single query and a single log line.
 * Removal target: after judging, 2026-09-19.
 */
const demoTravellerUser = cache(
  async (): Promise<Extract<NonNullable<CurrentUser>, { role: typeof USER_ROLES.traveller }> | null> => {
    const traveller = await getDemoTraveller();
    if (!traveller) {
      console.warn('[auth] demo traveller missing, falling back to login');
      return null;
    }
    console.info('[auth] demo traveller', { travellerId: traveller.id });
    return { role: USER_ROLES.traveller, traveller };
  },
);

/**
 * Hackathon-only: the traveller tree (layout, session-aware components, the booking pages) needs
 * the same "resolve to Jess" fallback `requireRole` uses, but without the redirect — these render
 * for a guest too. One host cookie flips the whole pitch between sides, so a host viewing the
 * traveller tree under bypass reads as Jess here rather than signed-out. Removal target: 2026-09-19.
 */
export const currentTravellerOrDemo = async (): Promise<
  Extract<NonNullable<CurrentUser>, { role: typeof USER_ROLES.traveller }> | null
> => {
  const user = await currentUser();
  if (user?.role === USER_ROLES.traveller) return user;
  return isDemoBypassEnabled() ? demoTravellerUser() : null;
};

/**
 * Server-side enforcement, deliberately not only in middleware: middleware is a redirect
 * convenience and has been bypassable by a crafted header (CVE-2025-29927). These run inside
 * the render, so a request that skips middleware still cannot see another role's UI.
 */
const requireRole = async <R extends CurrentUser extends null ? never : NonNullable<CurrentUser>['role']>(
  role: R,
): Promise<Extract<NonNullable<CurrentUser>, { role: R }>> => {
  const user = await currentUser();
  if (!user) {
    // Hackathon-only: host pages gate on the host cookie and admin already has its own demo path
    // above, so traveller is the only role that resolves to a demo identity here. Removal target: 2026-09-19.
    if (role === USER_ROLES.traveller && isDemoBypassEnabled()) {
      const demoUser = await demoTravellerUser();
      if (demoUser) return demoUser as Extract<NonNullable<CurrentUser>, { role: R }>;
    }
    redirect(ROUTES.login);
  }
  if (user.role !== role) {
    // Hackathon-only: a signed-in demo host may still open traveller pages as the demo traveller. Removal target: 2026-09-19.
    if (role === USER_ROLES.traveller && isDemoBypassEnabled()) {
      const demoUser = await demoTravellerUser();
      if (demoUser) return demoUser as Extract<NonNullable<CurrentUser>, { role: R }>;
    }
    redirect(ROLE_HOME_ROUTE[user.role]);
  }

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
  // Hackathon-only: the pitch flips between the host and traveller sides with one host cookie set. Removal target: 2026-09-19.
  if (isDemoBypassEnabled()) return;
  const user = await currentUser();
  if (user?.role === USER_ROLES.host) redirect(ROLE_HOME_ROUTE[USER_ROLES.host]);
};
