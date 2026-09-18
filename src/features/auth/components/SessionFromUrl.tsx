'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/core/constants';
import { createSupabaseBrowserClient } from '@/core/services/client';

const TOKEN_FRAGMENT = 'access_token=';

/**
 * A sign-in link minted server-side returns its tokens in the URL fragment, which never reaches
 * the server. Building the browser client here makes it read that fragment into cookies, after
 * which the server can resolve the role like any other sign-in.
 */
export function SessionFromUrl() {
  const router = useRouter();

  useEffect(() => {
    if (!window.location.hash.includes(TOKEN_FRAGMENT)) return;

    createSupabaseBrowserClient()
      .auth.getSession()
      .then(({ data }) => {
        if (data.session) router.replace(ROUTES.loginComplete);
      });
  }, [router]);

  return null;
}
