'use server';

import { z } from 'zod';
import { SIGN_IN_EMAIL_COPY } from '../constants';
import { sendSignInEmail } from '../services';

export interface SignInEmailState {
  error: string | null;
}

const emailSchema = z.email();

/** Anyone may ask for a code, as with any sign-in form; the answer never says whether the address is known. */
export const requestSignInEmailAction = async (email: unknown): Promise<SignInEmailState> => {
  const parsed = emailSchema.safeParse(typeof email === 'string' ? email.trim() : email);
  if (!parsed.success) return { error: SIGN_IN_EMAIL_COPY.invalid };

  try {
    await sendSignInEmail(parsed.data);
    return { error: null };
  } catch {
    return { error: SIGN_IN_EMAIL_COPY.failed };
  }
};
