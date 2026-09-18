'use client';

import { useEffect, useMemo, useState } from 'react';
import type { OfferingListQuery, OfferingSummary } from '@/shared/dto';
import { useSavedListings } from '../hooks';
import type { RegionWithSample } from '../services';
import { CategoryChips } from './CategoryChips';
import { FilterBar, type Filters } from './FilterBar';
import { ListingCardLink } from './ListingCardLink';
import { PlacesSection } from './PlacesSection';

const SEARCH_DEBOUNCE_MS = 300;

export function ExploreFeed({
  initialOfferings,
  regions,
  places,
  initialRegion,
}: {
  initialOfferings: OfferingSummary[];
  regions: string[];
  places: RegionWithSample[];
  initialRegion?: string;
}) {
  const [category, setCategory] = useState<OfferingListQuery['category']>(undefined);
  const [filters, setFilters] = useState<Filters>({
    region: initialRegion,
    q: undefined,
    groupSize: 1,
    sort: 'Recommended',
  });
  const [offerings, setOfferings] = useState(initialOfferings);
  const [isLoading, setIsLoading] = useState(false);
  const { savedIds, toggleSaved } = useSavedListings();

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (filters.region) params.set('region', filters.region);
    if (filters.q) params.set('q', filters.q);
    if (filters.groupSize > 1) params.set('groupSize', String(filters.groupSize));

    setIsLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/v1/offerings?${params.toString()}`)
        .then((res) => res.json())
        .then((body) => setOfferings(body.data))
        .finally(() => setIsLoading(false));
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [category, filters.region, filters.q, filters.groupSize]);

  const sorted = useMemo(() => {
    if (filters.sort === 'Price: low to high') return [...offerings].sort((a, b) => a.priceCents - b.priceCents);
    if (filters.sort === 'Price: high to low') return [...offerings].sort((a, b) => b.priceCents - a.priceCents);
    if (filters.sort === 'Top rated') return [...offerings].sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
    return offerings;
  }, [offerings, filters.sort]);

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-3 bg-canvas px-4 pb-3 tablet:-mx-6 tablet:px-6">
        <FilterBar
          regions={regions}
          filters={filters}
          onChange={(next) => setFilters((prev) => ({ ...prev, ...next }))}
        />
        <CategoryChips active={category} onChange={setCategory} />
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-body-md text-muted">Loading…</p>
      ) : sorted.length === 0 ? (
        <div className="py-12 text-center text-body-host text-muted">
          No listings match your filters. Try widening your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pt-4 tablet:grid-cols-2 desktop:grid-cols-3">
          {sorted.map((offering, index) => (
            <ListingCardLink
              key={offering.id}
              offering={offering}
              saved={savedIds.has(offering.id)}
              onToggleSave={toggleSaved}
              priority={index === 0}
            />
          ))}
        </div>
      )}

      {filters.region ? null : (
        <div className="pt-10">
          <PlacesSection regions={places} />
        </div>
      )}
    </div>
  );
}
