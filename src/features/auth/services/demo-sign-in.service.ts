import { API_ERROR_CODES, HTTP_STATUS, isMockAuthEnabled } from '@/core/constants';
import { createSupabaseAdminClient, createSupabaseServerClient, prisma } from '@/core/services';
import { ApiError } from '@/core/utils';
import { DEMO_LINK_TYPE, DEMO_TRAVELLER_EMAILS } from '../constants';

export interface DemoTraveller {
  email: string;
  name: string;
}

const notFound = (): ApiError => new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Not found');

const isDemoEmail = (email: string): email is (typeof DEMO_TRAVELLER_EMAILS)[number] =>
  (DEMO_TRAVELLER_EMAILS as readonly string[]).includes(email);

export const listDemoTravellers = (): Promise<DemoTraveller[]> =>
  prisma.traveller.findMany({
    where: { email: { in: [...DEMO_TRAVELLER_EMAILS] } },
    select: { email: true, name: true },
    orderBy: { name: 'asc' },
  });

/**
 * Hackathon-only, behind ALLOW_MOCK_AUTH: a real Supabase session without the inbox. The admin
 * API mints the link Supabase would have emailed and the token is verified here instead of by the
 * browser, so the cookies are set on this response and every guard downstream sees an ordinary
 * sign-in. Anything off the allowlist is a 404, the same answer as when the flag is off.
 * The token is verified as the type Supabase reports, not the type asked for: a magic link for an
 * address with no auth user yet comes back as a signup token, and verifying it as a magic link fails.
 * Removal target: after judging, 2026-09-19.
 */
export const signInDemoTraveller = async (email: unknown): Promise<void> => {
  if (!isMockAuthEnabled() || typeof email !== 'string' || !isDemoEmail(email)) throw notFound();

  const { data, error } = await createSupabaseAdminClient().auth.admin.generateLink({ type: DEMO_LINK_TYPE, email });
  if (error) throw error;

  const supabase = await createSupabaseServerClient();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: data.properties.hashed_token,
    type: data.properties.verification_type,
  });
  if (verifyError) throw verifyError;
};
