import { createBrowserClient } from '@supabase/ssr';

/**
 * These are read statically, not through requireEnv: Next.js only inlines a NEXT_PUBLIC_ value
 * into the browser bundle when it sees the full literal, so a dynamic process.env[key] lookup
 * arrives undefined at runtime.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createSupabaseBrowserClient = () => {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('Supabase is not configured for the browser. Check the NEXT_PUBLIC_SUPABASE_* build variables.');
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
};
