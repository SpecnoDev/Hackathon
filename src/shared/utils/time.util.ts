import { SA_LOCALE } from '@/core/constants';

const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_MONTH = 30;

const RELATIVE = new Intl.RelativeTimeFormat(SA_LOCALE, { numeric: 'auto' });

/** "3 hours ago", "yesterday". Anything older than a month is left to the absolute date beside it. */
export const relativeTime = (at: Date, now: Date = new Date()): string => {
  const minutes = Math.round((at.getTime() - now.getTime()) / MS_PER_MINUTE);
  if (Math.abs(minutes) < MINUTES_PER_HOUR) return RELATIVE.format(minutes, 'minute');

  const hours = Math.round(minutes / MINUTES_PER_HOUR);
  if (Math.abs(hours) < HOURS_PER_DAY) return RELATIVE.format(hours, 'hour');

  const days = Math.round(hours / HOURS_PER_DAY);
  if (Math.abs(days) < DAYS_PER_MONTH) return RELATIVE.format(days, 'day');

  return RELATIVE.format(Math.round(days / DAYS_PER_MONTH), 'month');
};
