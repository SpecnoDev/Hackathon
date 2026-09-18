import { API_ERROR_CODES, AUTHORIZATION_HEADER, BEARER_PREFIX, ENV_KEYS, HTTP_STATUS, requireEnv } from '../constants';
import { ApiError, isEqualSecret } from '../utils';

/** Machine-to-machine calls: the WhatsApp bot posting a completed profile. */
export const requireService = (request: Request): void => {
  const header = request.headers.get(AUTHORIZATION_HEADER) ?? '';
  const presented = header.startsWith(BEARER_PREFIX) ? header.slice(BEARER_PREFIX.length) : '';

  if (!isEqualSecret(presented, requireEnv(ENV_KEYS.internalApiToken))) {
    throw new ApiError(API_ERROR_CODES.unauthorized, HTTP_STATUS.unauthorized, 'Invalid service token');
  }
};
