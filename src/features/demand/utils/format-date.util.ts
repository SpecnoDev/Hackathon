import { SA_LOCALE } from '@/core/constants';

const DAY_LONG = new Intl.DateTimeFormat(SA_LOCALE, { weekday: 'short', day: 'numeric', month: 'short' });
const DAY_FULL = new Intl.DateTimeFormat(SA_LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
const MONTH_YEAR = new Intl.DateTimeFormat(SA_LOCALE, { month: 'long', year: 'numeric' });
const TIME_ONLY = new Intl.DateTimeFormat(SA_LOCALE, { hour: '2-digit', minute: '2-digit', hour12: false });
const DATE_ONLY_LENGTH = 10;
const PAD = 2;

/** A bare "YYYY-MM-DD" is read as local noon so a date never slips a day in either direction; a full timestamp is read as is. */
const parse = (iso: string): Date => (iso.length === DATE_ONLY_LENGTH ? new Date(`${iso}T12:00:00`) : new Date(iso));

export const formatDay = (iso: string): string => DAY_LONG.format(parse(iso));
export const formatDayFull = (iso: string): string => DAY_FULL.format(parse(iso));
/** "September 2026" — a review is dated to the month, which is as precise as a traveller needs. */
export const formatMonthYear = (iso: string): string => MONTH_YEAR.format(parse(iso));
export const formatClockTime = (iso: string): string => TIME_ONLY.format(new Date(iso));
export const formatDayAndTime = (iso: string, time: string | null): string => (time ? `${formatDay(iso)}, ${time}` : formatDay(iso));
export const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(PAD, '0')}-${String(date.getDate()).padStart(PAD, '0')}`;
