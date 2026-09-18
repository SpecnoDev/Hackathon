import { USER_ROLES, UserRole } from './auth.constant';

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  traveller: '/traveller',
  explore: '/traveller/explore',
  listings: '/traveller/listings',
  trips: '/traveller/trips',
  host: '/host',
  hostOnboarding: '/host/onboarding',
  hostListings: '/host/listings',
  hostBookings: '/host/bookings',
  hostEarnings: '/host/earnings',
  hostProfile: '/host/profile',
  flows: '/flows',
  admin: '/admin',
  adminHosts: '/admin/hosts',
  adminOfferings: '/admin/offerings',
} as const;

/**
 * Browsing is public: a traveller compares experiences before creating an account, and the
 * landing page links straight into it. A signed-in host is still redirected away by the role
 * matrix below, so public does not mean role-blind.
 */
export const PUBLIC_ROUTES = [ROUTES.login, ROUTES.signup, ROUTES.explore, ROUTES.listings] as const;

/**
 * A visitor picks their role on `home`, so both role homes must be reachable before any sign-in.
 * The whole `host` tree is guest-reachable while the host app runs on IndexedDB with no server session;
 * narrow this to `hostOnboarding` once host pages read from the API.
 */
export const GUEST_ROUTES = [ROUTES.home, ROUTES.host, ROUTES.explore, ROUTES.listings, ROUTES.flows] as const;

/** The whole subtree, so a route added under /traveller is covered without touching this file. */
export const TRAVELLER_ROUTES = [ROUTES.traveller] as const;
export const HOST_ROUTES = [ROUTES.host] as const;
export const ADMIN_ROUTES = [ROUTES.admin] as const;

export const ROLE_HOME_ROUTE = {
  [USER_ROLES.admin]: ROUTES.admin,
  [USER_ROLES.host]: ROUTES.host,
  [USER_ROLES.traveller]: ROUTES.explore,
} as const satisfies Record<UserRole, string>;

/** The redirect matrix: a role landing on another role's tree is sent to its own home. */
export const ROLE_FORBIDDEN_ROUTES = {
  [USER_ROLES.admin]: [...TRAVELLER_ROUTES, ...HOST_ROUTES],
  [USER_ROLES.host]: [...TRAVELLER_ROUTES, ...ADMIN_ROUTES],
  [USER_ROLES.traveller]: [...HOST_ROUTES, ...ADMIN_ROUTES],
} as const satisfies Record<UserRole, readonly string[]>;
