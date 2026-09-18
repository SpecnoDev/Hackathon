import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ENV_KEYS, requireEnv } from '../constants';

export const createSupabaseServerClient = async () => {
  const store = await cookies();

  return createServerClient(requireEnv(ENV_KEYS.supabaseUrl), requireEnv(ENV_KEYS.supabasePublishableKey), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (written) => {
        // A Server Component cannot write cookies; middleware refreshes the session instead.
        try {
          written.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {}
      },
    },
  });
};
