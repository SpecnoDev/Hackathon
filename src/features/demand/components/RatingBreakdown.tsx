import type { OfferingReview } from '@/shared/dto';
import { Icon } from '@/shared/components';
import { COPY_COMMON, STAR_VALUES } from '../constants';

const STAR_PX = 28;
const FULL_PERCENT = 100;

/** The average, then how the votes fall. Each bar has its count beside it, so the shape is never the only signal. */
export const RatingBreakdown = ({ average, reviews }: { average: number | null; reviews: OfferingReview[] }) => {
  if (average === null || reviews.length === 0) return null;
  const count = reviews.length;

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-surface-soft p-6">
      <div className="flex items-center gap-3">
        <Icon name="star" size={STAR_PX} className="fill-current text-star-rating" />
        <p className="font-display text-display-lg text-ink">{average.toFixed(1)}</p>
        <p className="text-body-md text-muted">{COPY_COMMON.reviewCount(count)}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {STAR_VALUES.map((stars) => {
          const votes = reviews.filter((review) => review.rating === stars).length;
          return (
            <li key={stars} className="flex items-center gap-3 text-caption text-ink">
              <span className="w-14 shrink-0">{COPY_COMMON.stars(stars)}</span>
              <span aria-hidden className="h-2 flex-1 overflow-hidden rounded-full bg-surface-strong">
                <span className="block h-full rounded-full bg-ink" style={{ width: `${(votes / count) * FULL_PERCENT}%` }} />
              </span>
              <span className="w-8 shrink-0 text-right text-muted">{votes}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
