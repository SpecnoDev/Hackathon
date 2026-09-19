'use server';

import { redirect } from 'next/navigation';
import { ROUTES } from '@/core/constants';
import { createSupabaseServerClient } from '@/core/services';

/** Ends the Supabase session and drops its cookies; a Server Action may write cookies where a page cannot. */
export const signOutTraveller = async (): Promise<void> => {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(ROUTES.login);
};
