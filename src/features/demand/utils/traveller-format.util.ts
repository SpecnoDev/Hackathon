import { SA_LOCALE } from '@/core/constants';
import { formatRand } from '@/shared/utils';
import { APPROX_ZAR_PER_UNIT, COPY_COMMON, MINUTES_PER_HOUR } from '../constants';
import type { ApproxCurrency, Listing } from '../interfaces';

const DAY_LONG = new Intl.DateTimeFormat(SA_LOCALE, { weekday: 'short', day: 'numeric', month: 'short' });
const DAY_FULL = new Intl.DateTimeFormat(SA_LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
const MONTH_YEAR = new Intl.DateTimeFormat(SA_LOCALE, { month: 'long', year: 'numeric' });
const TIME_ONLY = new Intl.DateTimeFormat(SA_LOCALE, { hour: '2-digit', minute: '2-digit', hour12: false });
const CENTS_PER_UNIT = 100;

/** "YYYY-MM-DD" is read as local noon so a date never slips a day in either direction. */
const localDate = (isoDate: string): Date => new Date(`${isoDate.slice(0, 10)}T12:00:00`);

export const formatDay = (isoDate: string): string => DAY_LONG.format(localDate(isoDate));
export const formatDayFull = (isoDate: string): string => DAY_FULL.format(localDate(isoDate));
export const formatMonthYear = (isoDate: string): string => MONTH_YEAR.format(localDate(isoDate));
export const formatClockTime = (iso: string): string => TIME_ONLY.format(new Date(iso));
export const toIsoDate = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const formatDuration = (minutes: number): string => {
  if (minutes < MINUTES_PER_HOUR) return COPY_COMMON.minutes(minutes);
  const hours = minutes / MINUTES_PER_HOUR;
  return COPY_COMMON.hours(Number.isInteger(hours) ? hours : Number(hours.toFixed(1)));
};

export const formatDayAndTime = (isoDate: string, time: string | null): string => (time ? `${formatDay(isoDate)}, ${time}` : formatDay(isoDate));

/** "R350 per person" or "R600 for the group". */
export const formatPrice = (listing: Pick<Listing, 'priceCents' | 'priceUnit'>): string => `${formatRand(listing.priceCents)} ${COPY_COMMON.priceUnit[listing.priceUnit]}`;

/** An approximate amount for international visitors. Shown next to the rand amount, never instead of it. */
export const formatApprox = (cents: number, currency: ApproxCurrency): string =>
  new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(cents / CENTS_PER_UNIT / APPROX_ZAR_PER_UNIT[currency]);
