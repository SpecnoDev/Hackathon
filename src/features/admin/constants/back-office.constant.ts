import type { AccountStatus, OfferingCategory, OfferingStatus, PayoutChannel, VerificationTier } from '@prisma/client';
import { ROUTES, SA_LOCALE } from '@/core/constants';
import type { IconName, StatusTone } from '@/shared/components';

/** The back office reads one screenful at a time; no list here is allowed to grow unbounded. */
export const ADMIN_LIST_LIMIT = 100;
export const ADMIN_HISTORY_LIMIT = 8;
export const RECENT_CHANGES_LIMIT = 6;

export const ADMIN_NAV = [
  { href: ROUTES.admin, label: 'Overview', icon: 'compass' },
  { href: ROUTES.adminHosts, label: 'Hosts', icon: 'users' },
  { href: ROUTES.adminTravellers, label: 'Travellers', icon: 'backpack' },
  { href: ROUTES.adminOfferings, label: 'Offerings', icon: 'tag' },
  { href: ROUTES.adminAudit, label: 'Audit trail', icon: 'shield-check' },
] as const satisfies readonly { href: string; label: string; icon: IconName }[];

export const ADMIN_SHELL_COPY = {
  title: 'Back office',
  navLabel: 'Back office sections',
  signedInAs: 'Signed in as',
  demo: {
    title: 'Demo mode',
    on: 'On',
    off: 'Off',
    turnOn: 'Turn on demo mode',
    turnOff: 'Turn off demo mode',
    note: 'Prefills the host app in this browser so the pitch runs without typing. Judges on their own devices see the real flow, and anything typed over a prefill wins.',
  },
} as const;

export const DEMO_MODE_FIELD = 'demoMode';

/** The bar and legend colours for a status, agreeing with the pill tones; the word is always beside them. */
export const STATUS_BAR_TONE: Record<StatusTone, string> = {
  draft: 'bg-surface-strong',
  review: 'bg-accent',
  live: 'bg-primary',
  paused: 'bg-border-strong',
  rejected: 'bg-error',
};

const plural = (count: number, noun: string): string => `${count} ${noun}${count === 1 ? '' : 's'}`;

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
    subtitle: 'What needs an operator first, then where Hosted stands.',
    queue: {
      title: 'Needs you',
      note: 'Open a row to work through it.',
      clear: 'The queue is clear. Nothing is waiting on an operator.',
      offeringsInReview: 'Offerings waiting for review',
      hostsInReview: 'Hosts waiting for approval',
      travellersInReview: 'Travellers waiting for approval',
      hostsSuspended: 'Suspended hosts',
      travellersSuspended: 'Suspended travellers',
    },
    glance: {
      title: 'At a glance',
      hosts: 'Hosts',
      travellers: 'Travellers',
      offerings: 'Offerings',
      active: 'active',
      live: 'live',
      total: (count: number) => `${count} in total`,
      none: 'None yet.',
    },
    money: {
      title: 'Bookings and money',
      bookingsInFlight: 'Bookings in flight',
      bookingsNote: 'Requested or confirmed, not finished',
      payoutsPending: 'Payouts pending',
      paidOut: 'Paid out to hosts',
      paidOutNote: (count: number) => `${plural(count, 'payout')} marked sent`,
      amountNote: (amount: string) => `${amount} in total`,
    },
    recent: {
      title: 'Recent changes',
      all: 'See the whole trail',
      empty: 'No admin has changed anything yet. Suspend a host or publish a listing and it lands here.',
    },
  },
  hosts: {
    title: 'Hosts',
    subtitle: 'Everyone who lists on Hosted. Open a host to approve, suspend or verify them.',
    count: (total: number) => plural(total, 'host'),
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
    offeringCount: (total: number) => plural(total, 'listing'),
    history: 'Recent admin history',
    joined: (date: string) => `Joined ${date}`,
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
    count: (total: number) => plural(total, 'traveller'),
    columns: { name: 'Name', email: 'Email', bookings: 'Bookings', status: 'Status', actions: 'Actions' },
    empty: {
      title: 'Your travellers show here',
      message: 'Nobody matches this filter yet. Choose All to see everyone.',
    },
  },
  offerings: {
    title: 'Offerings',
    subtitle: 'What hosts have sent for review. Approve it to take it live, or reject it with a reason.',
    count: (total: number) => plural(total, 'offering'),
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
