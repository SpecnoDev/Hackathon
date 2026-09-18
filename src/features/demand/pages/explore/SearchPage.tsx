'use client';

import { useCallback, useId } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Chip, Icon, Stepper, TextInput } from '@/shared/components';
import { TravellerScreen } from '../../components';
import { COPY_COMMON, COPY_EXPLORE, GUESTS_MAX, PLACES, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { SearchState, TravellerAppState } from '../../interfaces';
import { travellerAppStore } from '../../services/client';
import { toIsoDate } from '../../utils';

const copy = COPY_EXPLORE.search;
const MIN_GUESTS = 1;

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-title-sm text-ink">{title}</h2>
    {children}
  </section>
);

/** Screen 2: the full-screen search the pill opens. One line in your own words, or a place, a day and a head count. */
export const SearchPage = () => {
  const router = useRouter();
  const dateId = useId();
  const search = useTravellerApp(useCallback((state: TravellerAppState): SearchState => state.search, []));

  const submit = (patch: Partial<SearchState> = {}): void => {
    travellerAppStore.setSearch(patch);
    travellerAppStore.submitSearch();
    router.push(TRAVELLER_ROUTES.results);
  };

  return (
    <TravellerScreen
      barTitle={copy.title}
      backHref={TRAVELLER_ROUTES.home}
      width="column"
      action={
        <button type="button" onClick={() => travellerAppStore.clearSearch()} className="flex min-h-12 items-center px-3 text-link text-primary-text underline">
          {copy.clear}
        </button>
      }
      footer={
        <Button size="md" icon="search" onClick={() => submit()}>
          {copy.submit}
        </Button>
      }
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <TextInput label={copy.ask} value={search.query} onChange={(query) => travellerAppStore.setSearch({ query })} autoFocus />
          <ul className="flex flex-col">
            {copy.askExamples.map((example) => (
              <li key={example}>
                <button type="button" onClick={() => submit({ query: example })} className="flex min-h-12 w-full items-center gap-3 text-left text-body-md text-body active:bg-surface-soft">
                  <Icon name="sparkles" size={20} className="shrink-0 text-muted" />
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {search.recent.length > 0 ? (
          <Group title={copy.recent}>
            <ul className="flex flex-col">
              {search.recent.map((recent) => (
                <li key={recent}>
                  <button type="button" onClick={() => submit({ query: recent, placeSlug: undefined })} className="flex min-h-12 w-full items-center gap-3 text-left text-body-md text-ink active:bg-surface-soft">
                    <Icon name="clock" size={20} className="shrink-0 text-muted" />
                    {recent}
                  </button>
                </li>
              ))}
            </ul>
          </Group>
        ) : null}

        <Group title={copy.popular}>
          <div className="flex flex-wrap gap-2">
            {PLACES.map((place) => (
              <Chip key={place.slug} label={place.name} selected={search.placeSlug === place.slug} onToggle={() => travellerAppStore.setSearch({ placeSlug: search.placeSlug === place.slug ? undefined : place.slug })} />
            ))}
          </div>
        </Group>

        <Group title={copy.when}>
          <label htmlFor={dateId} className="sr-only">
            {copy.when}
          </label>
          <input
            id={dateId}
            type="date"
            min={toIsoDate(new Date())}
            value={search.date ?? ''}
            onChange={(event) => travellerAppStore.setSearch({ date: event.target.value || undefined })}
            className="h-14 w-full rounded-md border border-hairline bg-canvas px-4 text-body-md text-ink focus:border-ink focus:outline-none"
          />
          {search.date ? null : <p className="text-caption text-muted">{copy.whenAny}</p>}
        </Group>

        <Stepper
          label={copy.who}
          value={search.guests}
          min={MIN_GUESTS}
          max={GUESTS_MAX}
          decreaseLabel={copy.fewer}
          increaseLabel={copy.more}
          onChange={(guests) => travellerAppStore.setSearch({ guests })}
        />
        <p className="sr-only" aria-live="polite">
          {COPY_COMMON.guests(search.guests)}
        </p>
      </div>
    </TravellerScreen>
  );
};
