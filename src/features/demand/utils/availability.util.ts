import { BOOKABLE_DAYS_AHEAD, MS_PER_DAY, WEEKDAY_ORDER, type Weekday } from '../constants';
import { toIsoDate } from './format-date.util';

export interface Availability {
  /** Empty means any day, by arrangement. */
  weekdays: Weekday[];
  /** "HH:MM" start times. Empty means the host confirms a time. */
  times: string[];
}

const isWeekday = (value: unknown): value is Weekday => typeof value === 'string' && (WEEKDAY_ORDER as readonly string[]).includes(value);

/** `Offering.availability` is JSON. The seed writes `{ weekdays, times }`; the older `{ type: 'on_request' }` shape reads as any day, host confirms a time. */
export const readAvailability = (availability: Record<string, unknown>): Availability => ({
  weekdays: Array.isArray(availability.weekdays) ? availability.weekdays.filter(isWeekday) : [],
  times: Array.isArray(availability.times) ? availability.times.filter((time): time is string => typeof time === 'string') : [],
});

const CLOCK_DIGITS = 2;

/** No zone on purpose: a "YYYY-MM-DD" with a local time is read in the traveller's own zone, so a day never slips. */
const midnight = (isoDate: string): Date => new Date(`${isoDate}T00:00:00`);
const clockOf = (now: Date): string => [now.getHours(), now.getMinutes()].map((part) => String(part).padStart(CLOCK_DIGITS, '0')).join(':');

/** A day can be booked from today up to BOOKABLE_DAYS_AHEAD, on the weekdays the host runs this. No weekdays means any day. */
export const isBookableDay = (weekdays: readonly Weekday[], isoDate: string, now: Date): boolean => {
  const day = midnight(isoDate);
  const daysAhead = Math.round((day.getTime() - midnight(toIsoDate(now)).getTime()) / MS_PER_DAY);
  return daysAhead >= 0 && daysAhead <= BOOKABLE_DAYS_AHEAD && (weekdays.length === 0 || weekdays.includes(WEEKDAY_ORDER[day.getDay()]));
};

/** On the day itself, start times that have already passed are left out, so nobody books the past. */
export const openTimes = (times: readonly string[], isoDate: string | undefined, now: Date): string[] =>
  times.filter((time) => isoDate !== toIsoDate(now) || time > clockOf(now));
