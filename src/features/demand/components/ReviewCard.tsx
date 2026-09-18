import type { OfferingReview } from '@/shared/dto';
import { Icon } from '@/shared/components';
import { COPY_COMMON, STAR_COUNT } from '../constants';
import { formatMonthYear } from '../utils';

const STAR_PX = 14;

/** DESIGN.md review-card: the reviewer's initial in a grey circle, name and date, the stars, then their words. */
export const ReviewCard = ({ review }: { review: OfferingReview }) => (
  <li className="flex flex-col gap-3 rounded-lg border border-hairline p-5">
    <div className="flex items-center gap-3">
      <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-strong text-title-sm text-ink">
        {review.travellerName.charAt(0)}
      </span>
      <div className="flex min-w-0 flex-col">
        <p className="text-title-sm text-ink">{review.travellerName}</p>
        <p className="text-caption text-muted">{formatMonthYear(review.createdAt)}</p>
      </div>
    </div>
    <p role="img" aria-label={COPY_COMMON.stars(review.rating)} className="flex gap-0.5">
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <Icon key={index} name="star" size={STAR_PX} className={index < review.rating ? 'fill-current text-star-rating' : 'text-border-strong'} />
      ))}
    </p>
    {review.comment ? <p className="text-body-md text-body">{review.comment}</p> : null}
  </li>
);
