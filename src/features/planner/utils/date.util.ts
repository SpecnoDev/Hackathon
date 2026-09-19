import { MINUTES_PER_HOUR, SA_LOCALE } from '@/core/constants';
import { MS_PER_DAY } from '../constants';

const DAY_FORMAT = new Intl.DateTimeFormat(SA_LOCALE, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
const RANGE_FORMAT = new Intl.DateTimeFormat(SA_LOCALE, { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** `@db.Date` columns come back as UTC midnight, so every conversion here stays in UTC. */
export const toIsoDate = (date: Date): string => date.toISOString().slice(0, 10);

export const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * MS_PER_DAY);

export const tripDays = (start: Date, end: Date): string[] => {
  const count = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY) + 1;
  return Array.from({ length: count }, (_, index) => toIsoDate(addDays(start, index)));
};

export const formatDay = (isoDate: string): string => DAY_FORMAT.format(new Date(isoDate));

export const formatDateRange = (startIso: string, endIso: string): string =>
  `${RANGE_FORMAT.format(new Date(startIso))} to ${RANGE_FORMAT.format(new Date(endIso))}`;

/** "2 h 30 min", "45 min". */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const rest = minutes % MINUTES_PER_HOUR;
  return [hours && `${hours} h`, rest && `${rest} min`].filter(Boolean).join(' ');
};
