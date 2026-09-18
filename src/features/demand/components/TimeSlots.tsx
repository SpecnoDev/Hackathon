'use client';

import { Chip } from '@/shared/components';
import { COPY_BOOK, COPY_COMMON } from '../constants';
import { openTimes } from '../utils';

interface TimeSlotsProps {
  /** The host's start times, "HH:MM". Empty means the host confirms a time. */
  times: readonly string[];
  date?: string;
  selected?: string | null;
  onSelect: (time: string) => void;
}

export const TimeSlots = ({ times, date, selected, onSelect }: TimeSlotsProps) => {
  const open = openTimes(times, date, new Date());
  if (open.length === 0) return <p className="text-body-md text-body">{times.length === 0 ? COPY_COMMON.anyTime : COPY_BOOK.date.noTimesLeft}</p>;

  return (
    <div role="group" aria-label={COPY_BOOK.date.timeTitle} className="flex flex-wrap gap-2">
      {open.map((time) => (
        <Chip key={time} label={time} selected={selected === time} onToggle={() => onSelect(time)} />
      ))}
    </div>
  );
};
