'use client';

import { useEffect, useMemo, useState } from 'react';
import { ListingCard } from '@/shared/components';
import type { OfferingListQuery, OfferingSummary } from '@/shared/dto';
import { formatRands } from '@/shared/utils';
import { CategoryChips } from './CategoryChips';
import { FilterBar, type Filters } from './FilterBar';

const SEARCH_DEBOUNCE_MS = 300;

export function ExploreFeed({
  initialOfferings,
  regions,
}: {
  initialOfferings: OfferingSummary[];
  regions: string[];
}) {
  const [category, setCategory] = useState<OfferingListQuery['category']>(undefined);
  const [filters, setFilters] = useState<Filters>({
    region: undefined,
    q: undefined,
    groupSize: 1,
    sort: 'Recommended',
  });
  const [offerings, setOfferings] = useState(initialOfferings);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="mx-auto max-w-[1200px] px-4 py-4">
      <div className="sticky top-0 z-10 flex flex-col gap-3 bg-canvas pb-3">
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
          {sorted.map((offering) => (
            <ListingCard
              key={offering.id}
              href={`/listings/${offering.id}`}
              title={offering.title}
              photo={offering.photos[0]}
              photoAlt={offering.title}
              badge={offering.hostTier === 'COMMUNITY' ? 'Community verified' : offering.hostTier === 'IDENTITY' ? 'Verified' : undefined}
              meta={offering.town}
              host={`Hosted by ${offering.hostFirstName}`}
              rating={offering.avgRating}
              ratingCount={offering.reviewCount}
              newLabel="New"
              price={`From ${formatRands(offering.priceCents)}`}
              priceUnit="per person"
            />
          ))}
        </div>
      )}
    </div>
  );
}
