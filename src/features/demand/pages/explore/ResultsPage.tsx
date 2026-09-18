'use client';

import { useCallback, useState } from 'react';
import { Button, EmptyState, Icon } from '@/shared/components';
import { CategoryStrip, FilterSheet, ListingGrid, SearchPillLink, TravellerScreen } from '../../components';
import { COPY_COMMON, COPY_EXPLORE, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { Listing, TravellerAppState } from '../../interfaces';
import { countActiveFilters, findPlace, searchListings, travellerAppStore } from '../../services/client';
import { formatDay } from '../../utils';

const copy = COPY_EXPLORE.results;
const selectResults = (state: TravellerAppState): Listing[] => searchListings(state.search, state.filters);

const PillButton = ({ icon, label, pressed, onClick }: { icon: 'sliders' | 'map'; label: string; pressed?: boolean; onClick: () => void }) => (
  <button
    type="button"
    aria-pressed={pressed}
    onClick={onClick}
    className={`flex h-12 shrink-0 items-center gap-2 rounded-full border px-5 text-button-sm ${pressed ? 'border-ink bg-ink text-on-dark' : 'border-hairline bg-canvas text-ink'}`}
  >
    <Icon name={icon} size={16} />
    {label}
  </button>
);

/** Screen 3: a compact summary that reopens the search, the chips, the filters, then the same cards as everywhere else. */
export const ResultsPage = ({ filtersOpen = false }: { filtersOpen?: boolean }) => {
  const search = useTravellerApp(useCallback((state: TravellerAppState) => state.search, []));
  const filters = useTravellerApp(useCallback((state: TravellerAppState) => state.filters, []));
  const results = useTravellerApp(selectResults);
  const [sheetOpen, setSheetOpen] = useState(filtersOpen);
  const [showMap, setShowMap] = useState(false);
  const activeFilters = countActiveFilters(filters);

  const where = search.query.trim() || findPlace(search.placeSlug)?.name || copy.anywhere;
  const summary = [search.date ? formatDay(search.date) : copy.anyDay, COPY_COMMON.guests(search.guests)].join(' · ');

  return (
    <TravellerScreen barTitle={copy.title} backHref={TRAVELLER_ROUTES.home} showNav>
      <div className="flex flex-col gap-6">
        <div className="sticky top-14 z-10 -mx-4 flex flex-col gap-3 bg-canvas px-4 pb-3 tablet:-mx-6 tablet:px-6">
          <SearchPillLink label={where} summary={summary} />
          <CategoryStrip active={filters.category} onChange={(category) => travellerAppStore.setFilters({ category })} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-body-md text-muted" aria-live="polite">
            {copy.count(results.length)}
          </p>
          <div className="flex gap-2">
            <PillButton icon="sliders" label={activeFilters > 0 ? copy.filtersOn(activeFilters) : copy.filters} onClick={() => setSheetOpen(true)} />
            <PillButton icon="map" label={showMap ? copy.list : copy.map} pressed={showMap} onClick={() => setShowMap((shown) => !shown)} />
          </div>
        </div>

        {showMap ? (
          <div role="img" aria-label={copy.mapPlaceholder} className="flex aspect-video flex-col items-center justify-center gap-3 rounded-lg bg-surface-soft p-6 text-center text-muted">
            <Icon name="map" size={40} className="text-muted-soft" />
            <p className="max-w-xs text-body-sm">{copy.mapPlaceholder}</p>
          </div>
        ) : null}

        {results.length === 0 ? (
          <EmptyState
            illustration="missing"
            title={copy.emptyTitle}
            message={copy.empty}
            action={
              <Button
                size="md"
                variant="secondary"
                onClick={() => {
                  travellerAppStore.clearFilters();
                  travellerAppStore.clearSearch();
                }}
              >
                {copy.clear}
              </Button>
            }
          />
        ) : (
          <ListingGrid listings={results} />
        )}
      </div>
      {sheetOpen ? <FilterSheet onClose={() => setSheetOpen(false)} /> : null}
    </TravellerScreen>
  );
};
