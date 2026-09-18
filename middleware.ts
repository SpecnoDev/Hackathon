import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import {
  ENV_KEYS,
  HOST_ONBOARDED_CLAIM,
  HOST_SESSION_COOKIE,
  PUBLIC_ROUTES,
  ROLE_FORBIDDEN_ROUTES,
  ROLE_HOME_ROUTE,
  ROUTES,
  SESSION_TOKEN_SEPARATOR,
  USER_ROLES,
  requireEnv,
} from '@/core/constants';

type EdgeSession =
  | { role: typeof USER_ROLES.host; onboarded: boolean }
  | { role: typeof USER_ROLES.traveller }
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

  return user ? { role: USER_ROLES.traveller } : null;
};

const isWithin = (pathname: string, route: string): boolean =>
  pathname === route || pathname.startsWith(`${route}/`);

export const middleware = async (request: NextRequest): Promise<NextResponse> => {
  const { pathname } = request.nextUrl;
  if (PUBLIC_ROUTES.some((route) => isWithin(pathname, route))) return NextResponse.next();

  const response = NextResponse.next({ request });
  const session = await readSession(request, response);

  // Carries the cookies Supabase refreshed during readSession — dropping them signs the traveller out.
  const redirect = (route: string): NextResponse => {
    const redirected = NextResponse.redirect(new URL(route, request.url));
    response.cookies.getAll().forEach((cookie) => redirected.cookies.set(cookie));

    return redirected;
  };

  if (!session) return pathname === ROUTES.home ? response : redirect(ROUTES.login);

  const home = ROLE_HOME_ROUTE[session.role];
  if (pathname === ROUTES.home) return redirect(home);
  if (ROLE_FORBIDDEN_ROUTES[session.role].some((route) => isWithin(pathname, route))) return redirect(home);

  return session.role === USER_ROLES.host &&
    !session.onboarded &&
    !isWithin(pathname, ROUTES.hostOnboarding)
    ? redirect(ROUTES.hostOnboarding)
    : response;
};

// Next requires a statically analysable literal here, so this one list cannot come from
// route.constant.ts. Everything the matrix acts on is a page route: the API, the build output,
// the manifest, the service worker and every static asset are skipped before the code above runs.
export const config = {
  matcher: [
    '/((?!api|_next|manifest\\.webmanifest|sw\\.js|icons/|.*\\.(?:ico|png|jpg|jpeg|svg|webp|css|js|json|txt|xml)$).*)',
  ],
};
