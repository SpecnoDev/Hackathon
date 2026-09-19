'use client';

import { useActionState, useId, type ReactNode } from 'react';
import { Banner, Button } from '@/shared/components';
import { createTripAction } from '../actions';
import {
  DEFAULT_TRAVELLER_COUNT,
  DEFAULT_TRIP_NIGHTS,
  PLANNER_COPY,
  TRAVEL_THEMES,
  TRIP_DURATION_MAX_NIGHTS,
  TRIP_DURATION_MIN_NIGHTS,
  TRIP_TRAVELLERS_MAX,
  TRIP_TRAVELLERS_MIN,
} from '../constants';

const FIELD =
  'h-14 w-full rounded-md border border-hairline bg-canvas px-4 text-body-md text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink';
const THEME_PILL =
  'inline-flex min-h-12 cursor-pointer items-center rounded-full bg-surface-soft px-4 text-button-sm text-ink transition-colors peer-checked:bg-ink peer-checked:text-on-dark peer-focus-visible:outline-2 peer-focus-visible:outline-ink';

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="flex flex-col gap-2">
    <span className="text-caption text-ink">{label}</span>
    {children}
  </label>
);

interface PlanTripFormProps {
  /** Computed on the server so the first render agrees on both sides. */
  defaultDate: string;
  /** Regions with live experiences, so a typed destination lines up with what the panel can offer. */
  destinations: string[];
}

export const PlanTripForm = ({ defaultDate, destinations }: PlanTripFormProps) => {
  const [state, action, pending] = useActionState(createTripAction, {});
  const listId = useId();
  const copy = PLANNER_COPY.create;

  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label={copy.destination}>
        <input name="destination" list={listId} required minLength={2} maxLength={80} placeholder={copy.destinationPlaceholder} autoComplete="off" className={FIELD} />
        <datalist id={listId}>
          {destinations.map((destination) => (
            <option key={destination} value={destination} />
          ))}
        </datalist>
      </Field>
      <Field label={copy.departureFrom}>
        <input name="departureFrom" required minLength={2} maxLength={80} placeholder={copy.departurePlaceholder} autoComplete="off" className={FIELD} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={copy.duration}>
          <input name="durationNights" type="number" inputMode="numeric" min={TRIP_DURATION_MIN_NIGHTS} max={TRIP_DURATION_MAX_NIGHTS} defaultValue={DEFAULT_TRIP_NIGHTS} required className={FIELD} />
        </Field>
        <Field label={copy.travellers}>
          <input name="travellerCount" type="number" inputMode="numeric" min={TRIP_TRAVELLERS_MIN} max={TRIP_TRAVELLERS_MAX} defaultValue={DEFAULT_TRAVELLER_COUNT} required className={FIELD} />
        </Field>
      </div>
      <Field label={copy.departureDate}>
        <input name="departureDate" type="date" defaultValue={defaultDate} required className={FIELD} />
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-caption text-ink">{copy.theme}</legend>
        <div className="flex flex-wrap gap-2 pt-3">
          {TRAVEL_THEMES.map((theme, index) => (
            <label key={theme}>
              <input type="radio" name="theme" value={theme} defaultChecked={index === 0} className="peer sr-only" />
              <span className={THEME_PILL}>{theme}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {state.error ? <Banner tone="error">{state.error}</Banner> : null}
      <Button type="submit" size="md" disabled={pending}>
        {pending ? copy.submitting : copy.submit}
      </Button>
    </form>
  );
};
