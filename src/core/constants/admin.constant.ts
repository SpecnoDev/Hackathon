import type { AccountStatus } from '@prisma/client';

/** The verb of an AdminAction row; the value it moved the subject to is appended by `adminActionName`. */
export const ADMIN_ACTIONS = {
  hostStatus: 'HOST_STATUS',
  travellerStatus: 'TRAVELLER_STATUS',
  verificationTier: 'VERIFICATION_TIER',
  offeringStatus: 'OFFERING_STATUS',
} as const;

export type AdminActionType = (typeof ADMIN_ACTIONS)[keyof typeof ADMIN_ACTIONS];

export const ADMIN_SUBJECT_TYPES = { host: 'HOST', traveller: 'TRAVELLER', offering: 'OFFERING' } as const;

export type AdminSubjectType = (typeof ADMIN_SUBJECT_TYPES)[keyof typeof ADMIN_SUBJECT_TYPES];

const ADMIN_ACTION_SEPARATOR = ':';

/** `HOST_STATUS:SUSPENDED` — the trail is unreadable if the row records the verb without its outcome. */
export const adminActionName = (action: string, value: string): string => `${action}${ADMIN_ACTION_SEPARATOR}${value}`;

/** Filtering the trail is a prefix match, because the stored name carries the outcome after the verb. */
export const adminActionPrefix = (action: AdminActionType): string => `${action}${ADMIN_ACTION_SEPARATOR}`;

export const ADMIN_ACTION_QUERY_PARAM = 'action';

/**
 * Off the platform: these pause a host's live listings and are the only statuses that demand a
 * reason, because they are the ones a suspended host will ask an operator to explain.
 */
export const RESTRICTED_ACCOUNT_STATUSES: readonly AccountStatus[] = ['SUSPENDED', 'BLOCKED'];

/**
 * The only status that holds a session or shows a host's work publicly: IN_REVIEW is still waiting
 * on KYC, the restricted two are off the platform. Every gate asks this, never its own literal.
 */
export const ACTIVE_ACCOUNT_STATUS: AccountStatus = 'ACTIVE';

export const isAccountActive = (status: AccountStatus): boolean => status === ACTIVE_ACCOUNT_STATUS;

export const ADMIN_REASON_MAX_LENGTH = 500;
export const ADMIN_ACTION_LOG_DEFAULT_LIMIT = 50;
export const ADMIN_ACTION_LOG_MAX_LIMIT = 200;
