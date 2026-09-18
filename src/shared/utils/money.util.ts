import { BPS_DENOMINATOR, CENTS_PER_RAND, PLATFORM_FEE_BPS } from '@/core/constants';

const CURRENCY_SYMBOL = 'R';
/** DESIGN.md: "R1 250". Non-breaking so an amount never wraps mid-number. */
const THOUSANDS_SEPARATOR = ' ';
const THOUSANDS_GROUP = /\B(?=(\d{3})+(?!\d))/g;
const CENT_DIGITS = 2;

export const platformFeeCents = (totalCents: number): number =>
  Math.round((totalCents * PLATFORM_FEE_BPS) / BPS_DENOMINATOR);

export const hostReceivesCents = (totalCents: number): number => totalCents - platformFeeCents(totalCents);

export const platformFeePercent = (): number => (PLATFORM_FEE_BPS / BPS_DENOMINATOR) * 100;

/** Cents are shown only when there are any: "R510", "R127.50". */
export const formatRand = (cents: number): string => {
  const rand = Math.trunc(Math.abs(cents) / CENTS_PER_RAND);
  const remainder = Math.abs(cents) % CENTS_PER_RAND;
  const whole = String(rand).replace(THOUSANDS_GROUP, THOUSANDS_SEPARATOR);
  const fraction = remainder === 0 ? '' : `.${String(remainder).padStart(CENT_DIGITS, '0')}`;
  return `${cents < 0 ? '-' : ''}${CURRENCY_SYMBOL}${whole}${fraction}`;
};

export const randToCents = (rand: number): number => Math.round(rand * CENTS_PER_RAND);
