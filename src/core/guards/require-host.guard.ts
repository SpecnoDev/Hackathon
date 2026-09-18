import { API_ERROR_CODES, HTTP_STATUS } from '../constants';
import { readHostSession } from '../services';
import { ApiError } from '../utils';

/** Returns the host id every downstream query must be scoped by — never trust one from the body. */
export const requireHost = async (): Promise<string> => {
  const hostId = await readHostSession();
  if (!hostId) throw new ApiError(API_ERROR_CODES.unauthorized, HTTP_STATUS.unauthorized, 'Sign in to continue');

  return hostId;
};
