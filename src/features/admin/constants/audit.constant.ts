import { AccountStatus, OfferingStatus, VerificationTier } from '@prisma/client';
import {
  ADMIN_ACTIONS,
  ADMIN_ACTION_QUERY_PARAM,
  ADMIN_SUBJECT_TYPES,
  ROUTES,
  type AdminActionType,
  type AdminSubjectType,
  adminActionName,
} from '@/core/constants';

/** Replaced with the subject's own name, so the sentence reads about a person, not an id. */
export const AUDIT_SUBJECT_TOKEN = '{subject}';

/** Both account actions read the same: the sentence names the person, the row names their side. */
const accountSentences = (action: AdminActionType): Record<string, string> => ({
  [adminActionName(action, AccountStatus.IN_REVIEW)]: `sent ${AUDIT_SUBJECT_TOKEN} back for review`,
  [adminActionName(action, AccountStatus.ACTIVE)]: `reinstated ${AUDIT_SUBJECT_TOKEN}`,
  [adminActionName(action, AccountStatus.SUSPENDED)]: `suspended ${AUDIT_SUBJECT_TOKEN}`,
  [adminActionName(action, AccountStatus.BLOCKED)]: `blocked ${AUDIT_SUBJECT_TOKEN} permanently`,
});

/** Keyed by the stored action name, `VERB:OUTCOME`, so a row renders without re-deriving what it meant. */
export const AUDIT_SENTENCES: Record<string, string> = {
  ...accountSentences(ADMIN_ACTIONS.hostStatus),
  ...accountSentences(ADMIN_ACTIONS.travellerStatus),
  [adminActionName(ADMIN_ACTIONS.verificationTier, VerificationTier.REGISTERED)]:
    `reset ${AUDIT_SUBJECT_TOKEN} to registered only`,
  [adminActionName(ADMIN_ACTIONS.verificationTier, VerificationTier.IDENTITY)]:
    `verified ${AUDIT_SUBJECT_TOKEN}’s identity`,
  [adminActionName(ADMIN_ACTIONS.verificationTier, VerificationTier.COMMUNITY)]:
    `marked ${AUDIT_SUBJECT_TOKEN} community vouched`,
  [adminActionName(ADMIN_ACTIONS.offeringStatus, OfferingStatus.DRAFT)]:
    `sent “${AUDIT_SUBJECT_TOKEN}” back to draft`,
  [adminActionName(ADMIN_ACTIONS.offeringStatus, OfferingStatus.IN_REVIEW)]:
    `sent “${AUDIT_SUBJECT_TOKEN}” for review`,
  [adminActionName(ADMIN_ACTIONS.offeringStatus, OfferingStatus.LIVE)]: `published “${AUDIT_SUBJECT_TOKEN}”`,
  [adminActionName(ADMIN_ACTIONS.offeringStatus, OfferingStatus.PAUSED)]: `paused “${AUDIT_SUBJECT_TOKEN}”`,
  [adminActionName(ADMIN_ACTIONS.offeringStatus, OfferingStatus.REJECTED)]: `rejected “${AUDIT_SUBJECT_TOKEN}”`,
};

/** An action written before this table knew about it still reads as a sentence; the raw name stays on the row. */
export const AUDIT_FALLBACK_SENTENCE = `changed ${AUDIT_SUBJECT_TOKEN}`;

export const ADMIN_SUBJECT_LABELS: Record<AdminSubjectType, string> = {
  [ADMIN_SUBJECT_TYPES.host]: 'Host',
  [ADMIN_SUBJECT_TYPES.traveller]: 'Traveller',
  [ADMIN_SUBJECT_TYPES.offering]: 'Listing',
};

export const ADMIN_ACTION_TYPE_LABELS: Record<AdminActionType, string> = {
  [ADMIN_ACTIONS.hostStatus]: 'Host accounts',
  [ADMIN_ACTIONS.travellerStatus]: 'Traveller accounts',
  [ADMIN_ACTIONS.verificationTier]: 'Verification',
  [ADMIN_ACTIONS.offeringStatus]: 'Listings',
};

/** The filter is a URL, so a link to "who suspended this host" can be pasted into an incident thread. */
export const auditFilterHref = (action?: AdminActionType): string =>
  action ? `${ROUTES.adminAudit}?${ADMIN_ACTION_QUERY_PARAM}=${action}` : ROUTES.adminAudit;

export const AUDIT_COPY = {
  title: 'Audit trail',
  subtitle: 'Every back-office change, newest first. Each row says who did it, to whom, and why.',
  allActions: 'Everything',
  filterLabel: 'Filter by action',
  columns: { when: 'When', who: 'Who', what: 'What happened' },
  count: (total: number) => `${total} change${total === 1 ? '' : 's'}`,
  reasonSeparator: ' — ',
  metaSeparator: ' · ',
  noReason: 'No reason recorded',
  /** A subject deleted since the action was taken still has to be nameable. */
  missingSubject: (label: string) => `a deleted ${label.toLowerCase()}`,
  empty: 'No admin has changed anything yet. Suspend a host or publish a listing and it lands here.',
  emptyFiltered: 'Nothing of this kind yet. Choose "Everything" to see the rest of the trail.',
} as const;
