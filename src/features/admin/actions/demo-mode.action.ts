'use server';

import { cookies } from 'next/headers';
import { DEMO_MODE_COOKIE, DEMO_MODE_COOKIE_MAX_AGE_SECONDS, DEMO_MODE_ON } from '@/core/constants';
import { requireAdminPage } from '@/core/guards';
import { DEMO_MODE_FIELD } from '../constants';

/** Switches pitch mode for the browser the operator is using: a cookie the host app reads, never a deploy. */
export const setDemoModeAction = async (formData: FormData): Promise<void> => {
  await requireAdminPage();
  const jar = await cookies();

  if (formData.get(DEMO_MODE_FIELD) === DEMO_MODE_ON) {
    jar.set(DEMO_MODE_COOKIE, DEMO_MODE_ON, { path: '/', maxAge: DEMO_MODE_COOKIE_MAX_AGE_SECONDS, sameSite: 'lax' });
  } else {
    jar.delete(DEMO_MODE_COOKIE);
  }
};
