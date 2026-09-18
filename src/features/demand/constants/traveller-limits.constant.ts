export const TRAVELLER_APP_SCHEMA_VERSION = 1;

/** Date, guests, review, pay. */
export const BOOK_FLOW_STEPS = 4;

export const OTP_LENGTH = 4;
/** Demo only: OTP is mocked, so every code passes except this one, which lets the team show the error state. */
export const DEMO_REJECTED_OTP = '0000';
/** Demo only: a card number ending in this is declined, so the payment error state can be shown. */
export const DEMO_DECLINED_CARD_ENDING = '0000';
/** Demo only: how long the mocked gateway takes, so the processing state is visible on stage. */
export const DEMO_PAYMENT_DELAY_MS = 2200;

export const RECENT_SEARCHES_KEPT = 4;
export const REVIEWS_SHOWN_ON_LISTING = 2;
export const RAIL_CARDS = 8;
export const BOOKABLE_DAYS_AHEAD = 60;
export const GUESTS_MAX = 20;
export const STAR_COUNT = 5;
export const REVIEW_TEXT_MAX = 280;
export const PLAN_NAME_MAX = 40;
export const CARD_NUMBER_LENGTH = 16;
export const CARD_CVV_LENGTH = 3;

/** TODO: placeholders until live rates exist. Shown as "about", never used for payment. */
export const APPROX_ZAR_PER_UNIT = { USD: 18.2, EUR: 19.8, GBP: 23.4 } as const;

export const MS_PER_HOUR = 3_600_000;
export const MS_PER_DAY = 86_400_000;
export const MINUTES_PER_HOUR = 60;

export const PLAN_FIRST_DAY = 1;
/** The price the Profile tab uses to show what an approximate amount looks like: "R350 is about $19". */
export const APPROX_SAMPLE_CENTS = 35_000;

const TRAVELLER_PHONE_DIGITS_MIN = 9;
const TRAVELLER_PHONE_DIGITS_MAX = 15;
/**
 * TODO: the host side only accepts South African mobiles (`isSaMobile`). Travellers include visitors from abroad, so any
 * number of international length passes, with or without a leading "+", until real OTP delivery decides which countries we reach.
 */
export const TRAVELLER_PHONE_PATTERN = new RegExp(`^\\+?\\d{${TRAVELLER_PHONE_DIGITS_MIN},${TRAVELLER_PHONE_DIGITS_MAX}}$`);

export const OTP_RESEND_SECONDS = 30;
export const MS_PER_SECOND = 1000;
