import type { AccountStatus, OfferingCategory, OfferingStatus, PayoutChannel, VerificationTier } from '@prisma/client';
import { ROUTES, SA_LOCALE } from '@/core/constants';
import type { StatusTone } from '@/shared/components';

/** The back office reads one screenful at a time; no list here is allowed to grow unbounded. */
export const ADMIN_LIST_LIMIT = 100;
export const ADMIN_HISTORY_LIMIT = 8;

export const STATUS_FILTER_PARAM = 'status';
/** The moderation queue opens on what needs an operator, so "everything" has to be asked for by name. */
export const ALL_STATUSES_FILTER = 'ALL';

export const ADMIN_FORM_FIELDS = { status: 'status', tier: 'tier', reason: 'reason' } as const;

export const adminHostPath = (id: string): string => `${ROUTES.adminHosts}/${id}`;

export const ACCOUNT_STATUS_LABEL: Record<AccountStatus, string> = {
  IN_REVIEW: 'In review',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  BLOCKED: 'Blocked',
};

/** Nothing rests on colour: the pill always carries the word, the tone only agrees with it. */
export const ACCOUNT_STATUS_TONE: Record<AccountStatus, StatusTone> = {
  IN_REVIEW: 'review',
  ACTIVE: 'live',
  SUSPENDED: 'paused',
  BLOCKED: 'rejected',
};

export const OFFERING_STATUS_LABEL: Record<OfferingStatus, string> = {
  DRAFT: 'Draft',
  IN_REVIEW: 'In review',
  LIVE: 'Live',
  PAUSED: 'Paused',
  REJECTED: 'Rejected',
};

export const OFFERING_STATUS_TONE: Record<OfferingStatus, StatusTone> = {
  DRAFT: 'draft',
  IN_REVIEW: 'review',
  LIVE: 'live',
  PAUSED: 'paused',
  REJECTED: 'rejected',
};

export const VERIFICATION_TIER_LABEL: Record<VerificationTier, string> = {
  REGISTERED: 'Registered',
  IDENTITY: 'Identity verified',
  COMMUNITY: 'Community verified',
};

export const OFFERING_CATEGORY_LABEL: Record<OfferingCategory, string> = {
  TOUR: 'Tour',
  FOOD: 'Food',
  TRANSPORT: 'Transport',
  ACCOMMODATION: 'Stay',
  CONCIERGE: 'Concierge',
  SECURITY: 'Security',
  GUIDE: 'Guide',
};

export const PAYOUT_CHANNEL_LABEL: Record<PayoutChannel, string> = {
  BANK: 'Bank account',
  CASH_SEND: 'Cash send to their phone',
  WALLET: 'Mobile wallet',
  CASH_PICKUP: 'Cash pickup at a shop',
};

export const ADMIN_TIMESTAMP = new Intl.DateTimeFormat(SA_LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export const ADMIN_DATE = new Intl.DateTimeFormat(SA_LOCALE, { day: 'numeric', month: 'short', year: 'numeric' });

export const ADMIN_COPY = {
  filterAll: 'All',
  filterLabel: 'Filter by status',
  confirm: {
    cancel: 'Cancel',
    close: 'Close without changing anything',
    working: 'Saving',
    reasonRequired: {
      label: 'Why are you doing this?',
      helper: 'The reason is what makes the record worth keeping. One line is enough.',
    },
    reasonOptional: { label: 'Note (optional)', helper: 'Anything the next operator should know.' },
  },
  overview: {
    title: 'Overview',
    subtitle: 'Where Hosted stands right now. Every tile opens the list behind it.',
    hosts: 'Hosts',
    travellers: 'Travellers',
    offerings: 'Offerings',
    work: 'Work in flight',
    paidOut: 'Paid out to hosts',
    paidOutNote: 'Everything marked sent',
    bookingsInFlight: 'Bookings in flight',
    bookingsNote: 'Requested or confirmed, not finished',
    payoutsPending: 'Payouts pending',
    payoutsSent: 'Payouts sent',
    amountNote: (amount: string) => `${amount} in total`,
  },
  hosts: {
    title: 'Hosts',
    subtitle: 'Everyone who lists on Hosted. Open a host to approve, suspend or verify them.',
    columns: {
      name: 'Name',
      phone: 'Phone',
      area: 'Area',
      tier: 'Verification',
      status: 'Status',
      offerings: 'Offerings',
    },
    empty: {
      title: 'Your hosts show here',
      message: 'Nobody matches this filter yet. Choose All to see every host.',
    },
  },
  host: {
    back: 'All hosts',
    profile: 'Profile',
    actions: 'Actions',
    actionsNote: 'Suspending or blocking pauses their live offerings at once. Reinstating them does not republish those.',
    tier: 'Verification tier',
    tierField: 'Tier',
    tierNote: 'Override what KYC decided. The host keeps this tier until you change it again.',
    tierSave: 'Save tier',
    offerings: 'Their offerings',
    history: 'Recent admin history',
    reasonOnRecord: (reason: string) => `Reason on record: ${reason}`,
    changedAt: (when: string) => `Status changed ${when}`,
    fields: { phone: 'Phone', area: 'Area', joined: 'Joined', payout: 'Gets paid by' },
    noPayout: 'Not chosen yet',
    noStory: 'No story yet.',
    noOfferings: 'This host has not listed anything yet.',
    noHistory: 'No admin has touched this account yet.',
    offeringColumns: { title: 'Title', category: 'Kind', town: 'Town', price: 'Price', status: 'Status' },
  },
  travellers: {
    title: 'Travellers',
    subtitle: 'Everyone booking on Hosted. Suspend an account here and their bookings stop.',
    columns: { name: 'Name', email: 'Email', bookings: 'Bookings', status: 'Status', actions: 'Actions' },
    empty: {
      title: 'Your travellers show here',
      message: 'Nobody matches this filter yet. Choose All to see everyone.',
    },
  },
  offerings: {
    title: 'Offerings',
    subtitle: 'What hosts have sent for review. Approve it to take it live, or reject it with a reason.',
    columns: {
      title: 'Title',
      host: 'Host',
      town: 'Town',
      category: 'Kind',
      price: 'Price',
      status: 'Status',
      actions: 'Actions',
    },
    empty: {
      title: 'The queue is clear',
      message: 'Nothing is waiting for review. Choose All to see everything hosts have listed.',
    },
    noActions: 'Nothing to do',
  },
} as const;
