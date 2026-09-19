import { ENV_KEYS, ROUTES, requireEnv, withReturnTo } from '@/core/constants';
import { createSupabaseAdminClient, sendEmail } from '@/core/services';
import { SIGN_IN_EMAIL_COPY, SIGN_IN_LINK_TOKEN_PARAM, SIGN_IN_LINK_TYPE, SIGN_IN_LINK_TYPE_PARAM } from '../constants';

/**
 * Supabase mints the code and the token but never sends the email: its own sender allows a handful
 * an hour. Resend carries it instead, and the link verifies the token on our own route, so no
 * redirect allow-list is involved and the public app URL is the only origin a traveller ever sees.
 */
export const sendSignInEmail = async (email: string, returnTo: string | null): Promise<void> => {
  const { data, error } = await createSupabaseAdminClient().auth.admin.generateLink({ type: SIGN_IN_LINK_TYPE, email });
  if (error) throw error;

  const { email_otp: code, hashed_token: tokenHash, verification_type: type } = data.properties;
  const link = new URL(withReturnTo(ROUTES.loginComplete, returnTo), requireEnv(ENV_KEYS.appUrl));
  link.searchParams.set(SIGN_IN_LINK_TOKEN_PARAM, tokenHash);
  link.searchParams.set(SIGN_IN_LINK_TYPE_PARAM, type);

  await sendEmail({
    to: email,
    subject: SIGN_IN_EMAIL_COPY.subject,
    text: SIGN_IN_EMAIL_COPY.text(code, link.href),
    html: SIGN_IN_EMAIL_COPY.html(code, link.href),
  });
};
