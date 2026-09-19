import { createClient } from '@supabase/supabase-js';
import { ENV_KEYS, requireEnv } from '../constants';

/**
 * Server only. The secret key bypasses row-level security, so this client is for the few calls
 * that have no user session behind them: minting sign-in links, signing private document URLs.
 */
export const createSupabaseAdminClient = () =>
  createClient(requireEnv(ENV_KEYS.supabaseUrl), requireEnv(ENV_KEYS.supabaseSecretKey), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
