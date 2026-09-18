'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Chip, Icon, Stepper, TextInput } from '@/shared/components';
import type { OfferingListQuery } from '@/shared/dto';
import { COPY_COMMON, COPY_EXPLORE, DEFAULT_GUESTS, GUESTS_MAX, GUESTS_MIN, PLACES, SEARCH_FORM_ID } from '../constants';
import { useRecentSearches } from '../hooks';
import { resultsHref } from '../utils';

const copy = COPY_EXPLORE.search;

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="text-title-sm text-ink">{title}</h2>
    {children}
  </section>
);

const Suggestion = ({ icon, label, onPick }: { icon: 'sparkles' | 'clock'; label: string; onPick: () => void }) => (
  <li>
    <button type="button" onClick={onPick} className="flex min-h-12 w-full items-center gap-3 text-left text-body-md text-body active:bg-surface-soft">
      <Icon name={icon} size={20} className="shrink-0 text-muted" />
      {label}
    </button>
  </li>
);

/**
 * Screen 2: one line in your own words, or a place and a head count. Submitting goes to the results URL, so the
 * search is a link that can be shared or reopened. The pinned button lives in the page footer and submits by form id.
 */
export const SearchForm = ({ initial }: { initial: OfferingListQuery }) => {
  const router = useRouter();
  const { recent, remember } = useRecentSearches();
  const [query, setQuery] = useState(initial.q ?? '');
  const [region, setRegion] = useState(initial.region);
  const [guests, setGuests] = useState(initial.groupSize ?? DEFAULT_GUESTS);

  const search = (q: string, place = region): void => {
    remember(q);
    router.push(resultsHref({ q: q.trim() || undefined, region: place, groupSize: guests }));
  };

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    search(query);
  };

  return (
    <form id={SEARCH_FORM_ID} onSubmit={submit} className="flex flex-col gap-8">
      {/* The visible Search button is pinned in the page footer and targets this form by id; this one keeps Enter submitting everywhere. */}
      <button type="submit" hidden tabIndex={-1} aria-hidden />
      <div className="flex flex-col gap-3">
        <TextInput label={copy.ask} value={query} onChange={setQuery} autoFocus />
        <ul className="flex flex-col">
          {copy.askExamples.map((example) => (
            <Suggestion key={example} icon="sparkles" label={example} onPick={() => search(example, undefined)} />
          ))}
        </ul>
      </div>

      {recent.length > 0 ? (
        <Group title={copy.recent}>
          <ul className="flex flex-col">
            {recent.map((item) => (
              <Suggestion key={item} icon="clock" label={item} onPick={() => search(item, undefined)} />
            ))}
          </ul>
        </Group>
      ) : null}

      <Group title={copy.popular}>
        <div className="flex flex-wrap gap-2">
          {PLACES.map((place) => (
            <Chip key={place.slug} label={place.name} selected={region === place.name} onToggle={() => setRegion(region === place.name ? undefined : place.name)} />
          ))}
        </div>
      </Group>

      <Stepper label={copy.who} value={guests} min={GUESTS_MIN} max={GUESTS_MAX} decreaseLabel={copy.fewer} increaseLabel={copy.more} onChange={setGuests} />
      <p className="sr-only" aria-live="polite">
        {COPY_COMMON.guests(guests)}
      </p>
    </form>
  );
};
