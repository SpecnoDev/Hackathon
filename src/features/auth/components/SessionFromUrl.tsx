'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES, withReturnTo } from '@/core/constants';
import { createSupabaseBrowserClient } from '@/core/services/client';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

/**
 * A sign-in link minted server-side returns its tokens after the hash, which the browser never
 * sends to the server. The client is built for the PKCE flow and ignores that fragment, so the
 * tokens are read out by hand and set as the session, after which the server resolves the role.
 */
export function SessionFromUrl({ returnTo }: { returnTo: string | null }) {
  const router = useRouter();

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get(ACCESS_TOKEN);
    const refreshToken = fragment.get(REFRESH_TOKEN);
    if (!accessToken || !refreshToken) return;

    createSupabaseBrowserClient()
      .auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (!error) router.replace(withReturnTo(ROUTES.loginComplete, returnTo));
      });
  }, [router, returnTo]);

  return null;
}
