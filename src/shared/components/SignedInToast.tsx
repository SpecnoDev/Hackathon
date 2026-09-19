'use client';

import { useEffect } from 'react';
import { SIGNED_IN_COOKIE } from '@/core/constants';
import { useToast } from './Toast';

const COPY = { signedInAs: (name: string) => `Signed in as ${name}` };

const readCookie = (name: string): string | null => {
  const entry = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`));
  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
};

/** Greets once after the sign-in redirect, then eats the cookie so a reload stays quiet. */
export const SignedInToast = () => {
  const toast = useToast();

  useEffect(() => {
    const name = readCookie(SIGNED_IN_COOKIE);
    if (!name) return;
    document.cookie = `${SIGNED_IN_COOKIE}=; max-age=0; path=/`;
    toast(COPY.signedInAs(name));
  }, [toast]);

  return null;
};
