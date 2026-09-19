import { NextRequest, NextResponse } from 'next/server';
import { RETURN_TO_PARAM, ROUTES, safeReturnPath, withReturnTo } from '@/core/constants';
import { fail } from '@/core/utils';
import { DEMO_SIGN_IN_FIELD } from '@/features/auth/constants';
import { signInDemoTraveller } from '@/features/auth/services';

export const runtime = 'nodejs';

const SEE_OTHER = 303;

/** A plain form post from the login page; the redirect is what makes it a navigation. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const form = await request.formData();
    await signInDemoTraveller(form.get(DEMO_SIGN_IN_FIELD));
    const returnTo = form.get(RETURN_TO_PARAM);

    return NextResponse.redirect(
      new URL(withReturnTo(ROUTES.loginComplete, safeReturnPath(typeof returnTo === 'string' ? returnTo : null)), request.url),
      SEE_OTHER,
    );
  } catch (error) {
    return fail(error);
  }
}
