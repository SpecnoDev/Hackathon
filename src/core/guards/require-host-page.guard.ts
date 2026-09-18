import { Host } from '@prisma/client';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { ROLE_HOME_ROUTE, ROUTES, USER_ROLES } from '../constants';
import { getCurrentUser } from '../services';

/** Deduped so a layout, its page and a server action resolve the session once per request. */
const currentUser = cache(getCurrentUser);

/** The page twin of `requireHost`: a browser gets a redirect, not a 401. */
export const requireHostPage = async (): Promise<Host> => {
  const user = await currentUser();
  if (!user) redirect(ROUTES.login);
  if (user.role !== USER_ROLES.host) redirect(ROLE_HOME_ROUTE[user.role]);

  return user.host;
};
