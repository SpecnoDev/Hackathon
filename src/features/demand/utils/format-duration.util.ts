import { MINUTES_PER_HOUR } from '@/core/constants';
import { COPY_COMMON } from '../constants';

/** "45 minutes" under an hour, "2 hours" at or above — never a decimal, since durations are stored in whole minutes. */
export const formatDuration = (minutes: number | null): string | null => {
  if (minutes === null) return null;
  if (minutes < MINUTES_PER_HOUR) return COPY_COMMON.minutes(minutes);
  return COPY_COMMON.hours(Math.round(minutes / MINUTES_PER_HOUR));
};
