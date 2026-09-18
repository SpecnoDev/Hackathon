'use client';

import { useId, useState } from 'react';
import { Icon } from '@/shared/components';
import { BOOKABLE_DAYS_AHEAD, COPY_BOOK, COPY_COMMON, MS_PER_DAY, WEEKDAY_ORDER } from '../constants';
import type { Weekday } from '../interfaces';
import { isBookableDay } from '../services/client';
import { formatDayFull, formatMonthYear, toIsoDate } from '../utils';

const copy = COPY_BOOK.date;

/** 48px circles that give way a little on a 360px phone, where seven of them do not fit. DESIGN.md allows 44px for a date cell. */
const DAY = 'flex aspect-square w-full max-w-12 items-center justify-center rounded-full';
const DAY_OPEN = 'text-body-md text-ink active:bg-surface-soft';
const DAY_PICKED = 'bg-primary text-title-sm text-on-primary';
const DAY_CLOSED = 'text-body-md text-muted-soft line-through';
/** DESIGN.md: today gets a ring, not a colour, so it never competes with the chosen day. */
const DAY_TODAY = 'ring-1 ring-inset ring-ink';
const MONTH_STEP = 'flex size-12 items-center justify-center rounded-full text-ink active:bg-surface-soft disabled:text-muted-soft';

/** No zone on purpose: a "YYYY-MM-DD" with a local time is read in the traveller's own zone, so a day never slips. */
const LOCAL_MIDNIGHT = 'T00:00:00';

const midnight = (isoDate: string): Date => new Date(`${isoDate}${LOCAL_MIDNIGHT}`);
const addDays = (date: Date, days: number): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const monthOf = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);
const shiftMonth = (month: Date, by: number): Date => new Date(month.getFullYear(), month.getMonth() + by, 1);
const daysOf = (month: Date): Date[] => Array.from({ length: addDays(shiftMonth(month, 1), -1).getDate() }, (_, index) => addDays(month, index));

/** Opens on the chosen day when it can still be booked, else on the first day that can, never on a month of struck-out days. */
const openingMonth = (weekdays: readonly Weekday[], selected: string | undefined, now: Date): Date => {
  const canBook = (isoDate: string): boolean => isBookableDay(weekdays, isoDate, now);
  const firstOpen = Array.from({ length: BOOKABLE_DAYS_AHEAD + 1 }, (_, offset) => toIsoDate(addDays(now, offset))).find(canBook);
  const start = selected && canBook(selected) ? selected : firstOpen;
  return monthOf(start ? midnight(start) : now);
};

interface CalendarMonthProps {
  /** The weekdays the host runs this. Empty means any day. */
  weekdays: readonly Weekday[];
  /** "YYYY-MM-DD", once a day is picked. */
  selected?: string;
  onSelect: (isoDate: string) => void;
}

/** DESIGN.md date-picker-day: one month at a time, days that cannot be booked struck through and switched off. */
export const CalendarMonth = ({ weekdays, selected, onSelect }: CalendarMonthProps) => {
  const titleId = useId();
  const now = new Date();
  const today = toIsoDate(now);
  const [month, setMonth] = useState(() => openingMonth(weekdays, selected, now));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={copy.previousMonth}
          disabled={month.getTime() <= monthOf(now).getTime()}
          onClick={() => setMonth((current) => shiftMonth(current, -1))}
          className={MONTH_STEP}
        >
          <Icon name="chevron-left" />
        </button>
        <h2 id={titleId} aria-live="polite" className="text-title-md text-ink">
          {formatMonthYear(toIsoDate(month))}
        </h2>
        <button
          type="button"
          aria-label={copy.nextMonth}
          disabled={month.getTime() >= monthOf(addDays(now, BOOKABLE_DAYS_AHEAD)).getTime()}
          onClick={() => setMonth((current) => shiftMonth(current, 1))}
          className={MONTH_STEP}
        >
          <Icon name="chevron-right" />
        </button>
      </div>

      <div aria-hidden className="grid grid-cols-7 justify-items-center text-caption text-muted">
        {WEEKDAY_ORDER.map((weekday) => (
          <span key={weekday} className="py-2">
            {COPY_COMMON.weekdays[weekday]}
          </span>
        ))}
      </div>

      <div role="group" aria-labelledby={titleId} className="grid grid-cols-7 justify-items-center gap-y-1">
        {Array.from({ length: month.getDay() }, (_, index) => (
          <span key={index} />
        ))}
        {daysOf(month).map((date) => {
          const isoDate = toIsoDate(date);
          const open = isBookableDay(weekdays, isoDate, now);
          const picked = open && isoDate === selected;
          return (
            <button
              key={isoDate}
              type="button"
              disabled={!open}
              aria-pressed={picked}
              aria-label={isoDate === today ? copy.today(formatDayFull(isoDate)) : formatDayFull(isoDate)}
              onClick={() => onSelect(isoDate)}
              className={[DAY, open ? (picked ? DAY_PICKED : DAY_OPEN) : DAY_CLOSED, isoDate === today ? DAY_TODAY : ''].join(' ')}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
