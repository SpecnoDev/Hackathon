'use client';

import { Banner, Chip, Icon, OptionTile } from '@/shared/components';
import { AVAILABILITY_TYPES, HOST_COPY, WEEKDAYS } from '../constants';
import type { Availability } from '../interfaces';
import { formatDay } from '../utils';
import { ChoiceList } from './ChoiceList';

const copy = HOST_COPY.create.availability;

export const availabilityIssue = (availability: Availability): string | undefined => {
  if (availability.type === 'RECURRING' && availability.weekdays.length === 0) return copy.needDays;
  if (availability.type === 'DATES' && availability.dates.length === 0) return copy.needDates;
  return undefined;
};

interface AvailabilityEditorProps {
  availability: Availability;
  onChange: (availability: Availability) => void;
  error?: string;
}

export const AvailabilityEditor = ({ availability, onChange, error }: AvailabilityEditorProps) => (
  <div className="flex flex-col gap-6">
    <ChoiceList label={copy.title}>
      {AVAILABILITY_TYPES.map((option) => (
        <OptionTile
          key={option.type}
          icon={option.icon}
          title={copy.options[option.type].title}
          description={copy.options[option.type].description}
          selected={availability.type === option.type}
          onSelect={() => onChange({ ...availability, type: option.type })}
        />
      ))}
    </ChoiceList>

    {availability.type === 'RECURRING' ? (
      <div role="group" aria-label={copy.chooseDays} className="flex flex-col gap-3">
        <p className="text-caption text-ink">{copy.chooseDays}</p>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((day) => {
            const selected = availability.weekdays.includes(day);
            return (
              <Chip
                key={day}
                label={copy.weekdays[day]}
                selected={selected}
                onToggle={() => onChange({ ...availability, weekdays: selected ? availability.weekdays.filter((item) => item !== day) : [...availability.weekdays, day] })}
              />
            );
          })}
        </div>
      </div>
    ) : null}

    {availability.type === 'DATES' ? (
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-2 text-caption text-ink">
          {copy.addDate}
          <input
            type="date"
            value=""
            onChange={(event) => {
              const date = event.target.value;
              if (date && !availability.dates.includes(date)) onChange({ ...availability, dates: [...availability.dates, date].sort() });
            }}
            className="h-14 w-full rounded-md border border-hairline bg-canvas px-4 text-body-host text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          />
        </label>
        <ul className="flex flex-wrap gap-2">
          {availability.dates.map((date) => (
            <li key={date}>
              <button
                type="button"
                aria-label={copy.removeDate(formatDay(date))}
                onClick={() => onChange({ ...availability, dates: availability.dates.filter((item) => item !== date) })}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-surface-soft px-4 text-button-sm text-ink"
              >
                {formatDay(date)}
                <Icon name="x" size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    ) : null}

    {error ? <Banner tone="error">{error}</Banner> : null}
  </div>
);
