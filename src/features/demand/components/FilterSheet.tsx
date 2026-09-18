'use client';

import { useCallback } from 'react';
import { Button, Chip, Sheet, Stepper, ToggleRow } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { COPY_COMMON, COPY_EXPLORE, DURATION_FILTER_STEPS_MIN, GUESTS_MAX, LANGUAGES, PRICE_FILTER_STEPS_CENTS } from '../constants';
import { useTravellerApp } from '../hooks';
import type { TravellerAppState } from '../interfaces';
import { searchListings, travellerAppStore } from '../services/client';
import { formatDuration } from '../utils';

const copy = COPY_EXPLORE.results.filter;
const MIN_GUESTS = 1;

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="flex flex-col gap-3">
    <legend className="mb-3 text-title-sm text-ink">{title}</legend>
    <div className="flex flex-wrap gap-2">{children}</div>
  </fieldset>
);

/** Filters change the list behind the sheet as they are tapped, so "Show 7 places" is always true. */
export const FilterSheet = ({ onClose }: { onClose: () => void }) => {
  const filters = useTravellerApp(useCallback((state: TravellerAppState) => state.filters, []));
  const guests = useTravellerApp(useCallback((state: TravellerAppState) => state.search.guests, []));
  const count = useTravellerApp(useCallback((state: TravellerAppState) => searchListings(state.search, state.filters).length, []));

  return (
    <Sheet
      title={copy.title}
      closeLabel={COPY_COMMON.close}
      onClose={onClose}
      actions={
        <>
          <Button size="md" onClick={onClose}>
            {copy.apply(count)}
          </Button>
          <Button size="md" variant="secondary" onClick={() => travellerAppStore.clearFilters()}>
            {COPY_EXPLORE.results.clear}
          </Button>
        </>
      }
    >
      <div className="flex max-h-[50dvh] flex-col gap-6 overflow-y-auto text-body-md">
        <Group title={copy.price}>
          {PRICE_FILTER_STEPS_CENTS.map((cents) => (
            <Chip key={cents} label={formatRand(cents)} selected={filters.maxPriceCents === cents} onToggle={() => travellerAppStore.setFilters({ maxPriceCents: filters.maxPriceCents === cents ? undefined : cents })} />
          ))}
        </Group>
        <Group title={copy.duration}>
          {DURATION_FILTER_STEPS_MIN.map((minutes) => (
            <Chip
              key={minutes}
              label={formatDuration(minutes)}
              selected={filters.maxDurationMin === minutes}
              onToggle={() => travellerAppStore.setFilters({ maxDurationMin: filters.maxDurationMin === minutes ? undefined : minutes })}
            />
          ))}
        </Group>
        <Group title={copy.language}>
          {LANGUAGES.map((language) => (
            <Chip
              key={language.code}
              label={language.name}
              selected={filters.language === language.code}
              onToggle={() => travellerAppStore.setFilters({ language: filters.language === language.code ? undefined : language.code })}
            />
          ))}
        </Group>
        <Stepper
          label={COPY_EXPLORE.search.who}
          value={guests}
          min={MIN_GUESTS}
          max={GUESTS_MAX}
          decreaseLabel={COPY_EXPLORE.search.fewer}
          increaseLabel={COPY_EXPLORE.search.more}
          onChange={(value) => travellerAppStore.setSearch({ guests: value })}
        />
        <ToggleRow icon="shield-check" label={copy.verifiedOnly} checked={filters.verifiedOnly} onLabel={COPY_COMMON.on} offLabel={COPY_COMMON.off} onChange={(verifiedOnly) => travellerAppStore.setFilters({ verifiedOnly })} />
        <ToggleRow icon="calendar-check" label={copy.instantOnly} checked={filters.instantOnly} onLabel={COPY_COMMON.on} offLabel={COPY_COMMON.off} onChange={(instantOnly) => travellerAppStore.setFilters({ instantOnly })} />
      </div>
    </Sheet>
  );
};
