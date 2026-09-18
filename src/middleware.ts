import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import {
  ENV_KEYS,
  ADMIN_ROUTES,
  GUEST_ROUTES,
  HOST_ONBOARDED_CLAIM,
  HOST_SESSION_COOKIE,
  PUBLIC_ROUTES,
  ROLE_FORBIDDEN_ROUTES,
  ROLE_HOME_ROUTE,
  ROUTES,
  SESSION_TOKEN_SEPARATOR,
  USER_ROLES,
  isMockAuthEnabled,
  requireEnv,
} from '@/core/constants';

/**
 * The edge cannot reach the database, so a Supabase cookie resolves only to `authenticated`:
 * admin and traveller are indistinguishable here. The route group layouts make the
 * authoritative call, which is also why they, and not this file, are the security boundary.
 */
type EdgeSession =
  | { role: typeof USER_ROLES.host; onboarded: boolean }
  | { role: 'authenticated' }
  | null;

const HMAC_ALGORITHM = { name: 'HMAC', hash: 'SHA-256' } as const;
const BASE64URL_SUBSTITUTIONS: Record<string, string> = { '+': '-', '/': '_', '=': '' };
const encoder = new TextEncoder();

// Mirrors `sign()` in core/services/session.service.ts, which cannot be imported here:
// the edge runtime has no node:crypto.
const sign = async (payload: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(requireEnv(ENV_KEYS.sessionSecret)),
    HMAC_ALGORITHM,
    false,
    ['sign'],
  );
  const digest = await crypto.subtle.sign(HMAC_ALGORITHM.name, key, encoder.encode(payload));

  return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(
    /[+/=]/g,
    (char) => BASE64URL_SUBSTITUTIONS[char],
  );
};

const isEqualSignature = (received: string, expected: string): boolean =>
  received.length === expected.length &&
  [...received].reduce((diff, char, i) => diff | (char.charCodeAt(0) ^ expected.charCodeAt(i)), 0) === 0;

const readHostSession = async (token: string | undefined): Promise<EdgeSession> => {
  const [hostId, expiresAt, onboarded, signature] = token?.split(SESSION_TOKEN_SEPARATOR) ?? [];
  if (!hostId || !expiresAt || !onboarded || !signature) return null;

  const payload = [hostId, expiresAt, onboarded].join(SESSION_TOKEN_SEPARATOR);
  const isAuthentic = isEqualSignature(signature, await sign(payload));

  return isAuthentic && Number(expiresAt) > Date.now()
    ? { role: USER_ROLES.host, onboarded: onboarded === HOST_ONBOARDED_CLAIM.complete }
    : null;
};

/** The host cookie wins, and costs no network call — the same order core/services/current-user.service.ts uses. */
const readSession = async (request: NextRequest, response: NextResponse): Promise<EdgeSession> => {
  const host = await readHostSession(request.cookies.get(HOST_SESSION_COOKIE)?.value);
  if (host) return host;

  const supabase = createServerClient(
    requireEnv(ENV_KEYS.supabaseUrl),
    requireEnv(ENV_KEYS.supabasePublishableKey),
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (written) =>
          written.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? { role: 'authenticated' } : null;
};

const isWithin = (pathname: string, route: string): boolean =>
  pathname === route || pathname.startsWith(`${route}/`);

export const middleware = async (request: NextRequest): Promise<NextResponse> => {
  const { pathname } = request.nextUrl;
  if (PUBLIC_ROUTES.some((route) => isWithin(pathname, route))) return NextResponse.next();
  // Demo bypass: the layout guard hands out a demo operator identity, so nothing here should redirect first.
  if (isMockAuthEnabled() && ADMIN_ROUTES.some((route) => isWithin(pathname, route))) return NextResponse.next();

  const response = NextResponse.next({ request });
  const session = await readSession(request, response);

  // Carries the cookies Supabase refreshed during readSession — dropping them signs the traveller out.
  const redirect = (route: string): NextResponse => {
    const redirected = NextResponse.redirect(new URL(route, request.url));
    response.cookies.getAll().forEach((cookie) => redirected.cookies.set(cookie));

    return redirected;
  };

  if (!session) return GUEST_ROUTES.some((route) => isWithin(pathname, route)) ? response : redirect(ROUTES.login);

  // A Supabase session could be an admin or a traveller, and only the database knows which, so
  // both trees are let through here and their layouts turn the wrong one away.
  if (session.role !== USER_ROLES.host)
    return pathname === ROUTES.home ? redirect(ROUTES.explore) : response;

  // Ahead of the role matrix so an unfinished host reaches onboarding in one hop, from any route.
  if (!session.onboarded)
    return isWithin(pathname, ROUTES.hostOnboarding) ? response : redirect(ROUTES.hostOnboarding);

  const isForbidden = ROLE_FORBIDDEN_ROUTES[USER_ROLES.host].some((route) => isWithin(pathname, route));

  return pathname === ROUTES.home || isForbidden ? redirect(ROLE_HOME_ROUTE[USER_ROLES.host]) : response;
};

// Next requires a statically analysable literal here, so this one list cannot come from
// route.constant.ts. Everything the matrix acts on is a page route: the API, the build output,
// the manifest, the service worker and every static asset are skipped before the code above runs.
export const config = {
  matcher: [
    '/((?!api|_next|manifest\\.webmanifest|sw\\.js|icons/|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|json|txt|xml)$).*)',
  ],
};
