import { API_ERROR_CODES, DEMO_ADMIN_EMAIL, HTTP_STATUS, USER_ROLES, isMockAuthEnabled } from '../constants';
import { ApiError } from '../utils';
import { currentUser } from './require-role-page.guard';

/**
 * The route-handler twin of `requireAdminPage`: a fetch gets a 401, not a redirect. Same
 * email allowlist, resolved through the same `currentUser` — there is one admin check.
 * Returns the actor email every AdminAction row is stamped with.
 */
export const requireAdmin = async (): Promise<string> => {
  const user = await currentUser();
  if (user?.role !== USER_ROLES.admin && isMockAuthEnabled()) return DEMO_ADMIN_EMAIL;
  if (user?.role !== USER_ROLES.admin) {
    throw new ApiError(API_ERROR_CODES.unauthorized, HTTP_STATUS.unauthorized, 'Sign in as an admin to continue');
  }

  return user.email;
};
