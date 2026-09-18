import { Icon } from '@/shared/components';
import { COPY_COMMON, COPY_EXPLORE } from '../constants';
import type { Listing } from '../interfaces';
import { ratingOf } from '../services/client';

const STAR_PX = 28;
const STAR_VALUES = [5, 4, 3, 2, 1] as const;
const FULL_PERCENT = 100;

/** The average, then how the votes fall. Each bar has its count beside it, so the shape is never the only signal. */
export const RatingBreakdown = ({ listing }: { listing: Listing }) => {
  const { average, count } = ratingOf(listing);
  if (average === null) return null;

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-surface-soft p-6">
      <div className="flex items-center gap-3">
        <Icon name="star" size={STAR_PX} className="fill-current text-star-rating" />
        <p className="font-display text-display-lg text-ink">{average.toFixed(1)}</p>
        <p className="text-body-md text-muted">{COPY_COMMON.reviewCount(count)}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {STAR_VALUES.map((stars, index) => (
          <li key={stars} className="flex items-center gap-3 text-caption text-ink">
            <span className="w-14 shrink-0">{COPY_EXPLORE.reviews.stars(stars)}</span>
            <span aria-hidden className="h-2 flex-1 overflow-hidden rounded-full bg-surface-strong">
              <span className="block h-full rounded-full bg-ink" style={{ width: `${(listing.ratings[index] / count) * FULL_PERCENT}%` }} />
            </span>
            <span className="w-8 shrink-0 text-right text-muted">{listing.ratings[index]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
