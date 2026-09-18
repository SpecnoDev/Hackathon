import { createBrowserClient } from '@supabase/ssr';
import { ENV_KEYS, requireEnv } from '@/core/constants';

export const createSupabaseBrowserClient = () =>
  createBrowserClient(requireEnv(ENV_KEYS.supabaseUrl), requireEnv(ENV_KEYS.supabasePublishableKey));
