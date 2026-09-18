import { HOURS_PER_DAY, MINUTES_PER_HOUR, MS_PER_SECOND, SECONDS_PER_MINUTE } from '@/core/constants';
import type { IconName } from '@/shared/components';
import type { PaymentMethod } from '@/shared/dto';

export const MS_PER_DAY = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;

/** Date, guests, review, pay. */
export const BOOK_FLOW_STEPS = 4;
export const BOOK_STEP = { date: 1, guests: 2, review: 3, pay: 4 } as const;
export const BOOKABLE_DAYS_AHEAD = 60;
/** Sunday first, as `Date.getDay()` counts. */
export const WEEKDAY_ORDER = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
export type Weekday = (typeof WEEKDAY_ORDER)[number];
/** A booking whose host still has to confirm a time is treated as starting here when the refund window is worked out. */
export const DEFAULT_START_TIME = '09:00';

export const PAYMENT_METHOD_ICON: Record<PaymentMethod, IconName> = {
  CARD: 'credit-card',
  INSTANT_EFT: 'bank',
  QR: 'qr-code',
  WALLET: 'smartphone',
};

/** Demo only: a card number ending in this is declined, so the payment error state can be shown. */
export const DEMO_DECLINED_CARD_ENDING = '0000';
/** Demo only: how long the mocked gateway takes, so the processing state is visible on stage. */
export const DEMO_PAYMENT_DELAY_MS = 2200;
export const CARD_NUMBER_LENGTH = 16;
export const CARD_CVV_LENGTH = 3;
export const TRAVELLER_PHONE_PATTERN = /^\+?\d{9,15}$/;
const PHONE_SEPARATORS = /[\s().-]/g;
export const normalisePhone = (typed: string): string => typed.replace(PHONE_SEPARATORS, '');

/** The draft lives in sessionStorage per listing, so a sign-in in the middle of the flow does not lose it. */
export const bookingDraftKey = (offeringId: string): string => `traveller.booking.${offeringId}`;

/** TODO: placeholder. Hosts have no public number, and there is no support number in the repo yet. */
export const SUPPORT_WHATSAPP_NUMBER = '+27600000000';
