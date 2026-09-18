import { API_ERROR_CODES, HTTP_STATUS } from '../constants';
import { findActiveHostId, readHostSession } from '../services';
import { ApiError } from '../utils';

/**
 * Returns the host id every downstream query must be scoped by — never trust one from the body.
 * The cookie only proves who signed in, so the account is re-read here: suspending a host has to
 * take their next request away, not wait out the session's seven days.
 */
export const requireHost = async (): Promise<string> => {
  const sessionHostId = await readHostSession();
  const hostId = sessionHostId && (await findActiveHostId(sessionHostId));
  if (!hostId) throw new ApiError(API_ERROR_CODES.unauthorized, HTTP_STATUS.unauthorized, 'Sign in to continue');

  return hostId;
};
