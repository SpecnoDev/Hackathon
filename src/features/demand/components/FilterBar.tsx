'use client';

import type { OfferingListQuery } from '@/shared/dto';

export const SORT_OPTIONS = ['Recommended', 'Price: low to high', 'Price: high to low', 'Top rated'] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export type Filters = {
  region: OfferingListQuery['region'];
  q: OfferingListQuery['q'];
  groupSize: number;
  sort: SortOption;
};

export function FilterBar({
  regions,
  filters,
  onChange,
}: {
  regions: string[];
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
}) {
  return (
    <div className="flex flex-col gap-2 tablet:flex-row tablet:items-center">
      <input
        type="search"
        value={filters.q ?? ''}
        onChange={(e) => onChange({ q: e.target.value || undefined })}
        placeholder="Search listings"
        className="h-12 flex-1 rounded-full border border-hairline px-4 text-body-md text-ink placeholder:text-muted-soft"
      />

      <select
        value={filters.region ?? ''}
        onChange={(e) => onChange({ region: e.target.value || undefined })}
        className="h-12 rounded-full border border-hairline px-4 text-body-md text-ink"
      >
        <option value="">All regions</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      <div className="flex h-12 items-center gap-2 rounded-full border border-hairline px-4">
        <button
          type="button"
          onClick={() => onChange({ groupSize: Math.max(1, filters.groupSize - 1) })}
          aria-label="Fewer guests"
          className="text-title-sm text-ink"
        >
          −
        </button>
        <span className="min-w-[64px] text-center text-body-sm text-ink">{filters.groupSize} guests</span>
        <button
          type="button"
          onClick={() => onChange({ groupSize: filters.groupSize + 1 })}
          aria-label="More guests"
          className="text-title-sm text-ink"
        >
          +
        </button>
      </div>

      <select
        value={filters.sort}
        onChange={(e) => onChange({ sort: e.target.value as SortOption })}
        className="h-12 rounded-full border border-hairline px-4 text-body-md text-ink"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            Sort: {option}
          </option>
        ))}
      </select>
    </div>
  );
}
