import type { DraftRowId, PayoutChannel } from '../interfaces';

const HOST = '/host';
const OFFERINGS = `${HOST}/offerings`;
const CREATE = `${OFFERINGS}/new`;
const BOOKINGS = `${HOST}/bookings`;
const EARNINGS = `${HOST}/earnings`;
const PROFILE = `${HOST}/profile`;
const REGISTER = `${HOST}/register`;
const VERIFY = `${HOST}/verify`;

export const PAYOUT_CHANNEL_SLUG: Record<PayoutChannel, string> = {
  CASH_SEND: 'cash-send',
  BANK: 'bank',
  WALLET: 'wallet',
  CASH_PICKUP: 'cash-pickup',
};

export const payoutChannelFromSlug = (slug: string): PayoutChannel | undefined =>
  (Object.keys(PAYOUT_CHANNEL_SLUG) as PayoutChannel[]).find((channel) => PAYOUT_CHANNEL_SLUG[channel] === slug);

export const HOST_ROUTES = {
  flows: '/flows',
  home: HOST,
  welcome: `${HOST}/welcome`,
  register: {
    language: `${REGISTER}/language`,
    phone: `${REGISTER}/phone`,
    code: `${REGISTER}/code`,
    name: `${REGISTER}/name`,
    contact: `${REGISTER}/contact`,
    done: `${REGISTER}/done`,
    alreadyRegistered: `${REGISTER}/already-registered`,
    noAccount: `${REGISTER}/no-account`,
  },
  verify: {
    why: VERIFY,
    document: `${VERIFY}/document`,
    documentPhoto: `${VERIFY}/document-photo`,
    selfie: `${VERIFY}/selfie`,
    checking: `${VERIFY}/checking`,
    result: `${VERIFY}/result`,
    community: `${VERIFY}/community`,
  },
  create: {
    category: CREATE,
    voice: `${CREATE}/voice`,
    draft: `${CREATE}/draft`,
    form: (step: number): string => `${CREATE}/form/${step}`,
    field: (row: DraftRowId): string => `${CREATE}/edit/${row}`,
    photos: `${CREATE}/photos`,
    availability: `${CREATE}/availability`,
    preview: `${CREATE}/preview`,
    published: `${CREATE}/published`,
  },
  offerings: {
    list: OFFERINGS,
    detail: (id: string): string => `${OFFERINGS}/${id}`,
    edit: (id: string): string => `${OFFERINGS}/${id}/edit`,
    editField: (id: string, row: DraftRowId): string => `${OFFERINGS}/${id}/edit/${row}`,
  },
  bookings: {
    list: BOOKINGS,
    detail: (id: string): string => `${BOOKINGS}/${id}`,
    decline: (id: string): string => `${BOOKINGS}/${id}/decline`,
    cancel: (id: string): string => `${BOOKINGS}/${id}/cancel`,
    completed: (id: string): string => `${BOOKINGS}/${id}/completed`,
  },
  earnings: {
    home: EARNINGS,
    payoutMethod: `${EARNINGS}/payout-method`,
    payoutDetails: (channel: PayoutChannel): string => `${EARNINGS}/payout-method/${PAYOUT_CHANNEL_SLUG[channel]}`,
    payout: (id: string): string => `${EARNINGS}/payouts/${id}`,
    fees: `${EARNINGS}/fees`,
  },
  profile: {
    home: PROFILE,
    language: `${PROFILE}/language`,
    notifications: `${PROFILE}/notifications`,
  },
} as const;
