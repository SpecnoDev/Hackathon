import { COPY_BOOKINGS, COPY_EARNINGS, COPY_PROFILE } from './copy-money.constant';
import { COPY_CREATE, COPY_OFFERINGS } from './copy-offerings.constant';
import { COPY_COMMON, COPY_REGISTER, COPY_VERIFY, COPY_WELCOME } from './copy-onboarding.constant';

/**
 * English only for now. The PRD wants EN, AF, XH and ZU; DESIGN.md wants every other language
 * checked by a first-language speaker before it ships, so none are machine-written here.
 */
export const HOST_COPY = {
  common: COPY_COMMON,
  welcome: COPY_WELCOME,
  register: COPY_REGISTER,
  verify: COPY_VERIFY,
  create: COPY_CREATE,
  offerings: COPY_OFFERINGS,
  bookings: COPY_BOOKINGS,
  earnings: COPY_EARNINGS,
  profile: COPY_PROFILE,
} as const;
