import { USER_ROLES, UserRole } from './auth.constant';

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  explore: '/explore',
  listings: '/listings',
  trips: '/trips',
  host: '/host',
  hostOnboarding: '/host/register',
  flows: '/flows',
} as const;

/** Reachable without a session. `home` is deliberately absent — it is public, but a signed-in user is sent to their own home. */
export const PUBLIC_ROUTES = [ROUTES.login, ROUTES.signup] as const;

/**
 * A visitor picks their role on `home`, so both role homes must be reachable before any sign-in.
 * The whole `host` tree is guest-reachable while the host app runs on IndexedDB with no server session;
 * narrow this to `hostOnboarding` once host pages read from the API.
 */
export const GUEST_ROUTES = [ROUTES.home, ROUTES.host, ROUTES.explore, ROUTES.listings, ROUTES.flows] as const;

export const TRAVELLER_ROUTES = [ROUTES.explore, ROUTES.listings, ROUTES.trips] as const;
export const HOST_ROUTES = [ROUTES.host] as const;

export const ROLE_HOME_ROUTE = {
  [USER_ROLES.host]: ROUTES.host,
  [USER_ROLES.traveller]: ROUTES.explore,
} as const satisfies Record<UserRole, string>;

/** The redirect matrix: a role landing on one of its forbidden routes is sent to its own home. */
export const ROLE_FORBIDDEN_ROUTES = {
  [USER_ROLES.host]: TRAVELLER_ROUTES,
  [USER_ROLES.traveller]: HOST_ROUTES,
} as const satisfies Record<UserRole, readonly string[]>;
