import { Icon } from '@/shared/components';
import { COPY_EXPLORE, COPY_TRIPS, STAR_COUNT } from '../constants';

const STAR_PX = 32;
const copy = COPY_TRIPS.review.rating;

interface StarInputProps {
  /** Read out as the group name; usually the screen's question. */
  label: string;
  /** 0 until a star is chosen. */
  value: number;
  onChange: (value: number) => void;
}

/** Five 48px stars. The choice is also written out underneath, so it never rests on the orange fill alone. */
export const StarInput = ({ label, value, onChange }: StarInputProps) => (
  <div className="flex flex-col gap-2">
    {/* Pulled left by the 8px between a 48px target and its 32px glyph, so the first star lines up with the text. */}
    <div role="radiogroup" aria-label={label} className="-ml-2 flex gap-1">
      {Array.from({ length: STAR_COUNT }, (_, index) => index + 1).map((stars) => (
        <button
          key={stars}
          type="button"
          role="radio"
          aria-checked={value === stars}
          aria-label={COPY_EXPLORE.reviews.stars(stars)}
          onClick={() => onChange(stars)}
          className="flex size-12 items-center justify-center rounded-full"
        >
          <Icon name="star" size={STAR_PX} className={stars <= value ? 'fill-current text-star-rating' : 'text-border-strong'} />
        </button>
      ))}
    </div>
    <p aria-live="polite" className="text-title-sm text-ink">
      {value ? copy.chosen(COPY_EXPLORE.reviews.stars(value), copy.words[value - 1]) : copy.none}
    </p>
  </div>
);
