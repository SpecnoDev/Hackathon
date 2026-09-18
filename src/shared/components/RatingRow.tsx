import { Icon } from './Icon';

const STAR_PX = 14;

interface RatingRowProps {
  /** Null until the first review. */
  rating: number | null;
  count: number;
  /** Shown instead of a row of zeros when nobody has reviewed yet, e.g. "New". */
  newLabel: string;
  /** Read out in place of the glyph and the digits, e.g. "Rated 4.9 out of 5 by 23 travellers". */
  label?: string;
}

/** DESIGN.md rating-row: an orange star, the rating in ink, the count in muted. */
export const RatingRow = ({ rating, count, newLabel, label }: RatingRowProps) =>
  rating === null ? (
    <span className="text-caption text-muted">{newLabel}</span>
  ) : (
    <span role="img" aria-label={label} className="inline-flex items-center gap-1 text-caption text-ink">
      <Icon name="star" size={STAR_PX} className="fill-current text-star-rating" />
      {rating.toFixed(1)}
      <span className="text-muted">({count})</span>
    </span>
  );
