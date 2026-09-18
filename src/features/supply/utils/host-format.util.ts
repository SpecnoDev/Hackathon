import { SA_LOCALE } from '@/core/constants';
import { HOST_COPY, MINUTES_PER_HOUR } from '../constants';
import type { PriceUnit } from '../interfaces';

const HALF_DAY_MIN = 240;
const FULL_DAY_MIN = 480;

const DAY_AND_TIME = new Intl.DateTimeFormat(SA_LOCALE, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const DAY_ONLY = new Intl.DateTimeFormat(SA_LOCALE, { weekday: 'short', day: 'numeric', month: 'short' });
const TIME_ONLY = new Intl.DateTimeFormat(SA_LOCALE, { hour: '2-digit', minute: '2-digit' });

export const formatDuration = (minutes: number): string => {
  if (minutes === HALF_DAY_MIN) return HOST_COPY.create.draft.halfDay;
  if (minutes === FULL_DAY_MIN) return HOST_COPY.create.draft.fullDay;
  return minutes % MINUTES_PER_HOUR === 0
    ? HOST_COPY.create.draft.hours(minutes / MINUTES_PER_HOUR)
    : HOST_COPY.create.draft.minutes(minutes);
};

export const formatDayAndTime = (iso: string): string => DAY_AND_TIME.format(new Date(iso));
export const formatDay = (iso: string): string => DAY_ONLY.format(new Date(iso));
export const formatTime = (iso: string): string => TIME_ONLY.format(new Date(iso));

export const priceUnitLabel = (unit: PriceUnit): string =>
  unit === 'PER_PERSON' ? HOST_COPY.common.perPerson : HOST_COPY.common.perTrip;
