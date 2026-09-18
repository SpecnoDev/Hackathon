import Image from 'next/image';
import Link from 'next/link';
import { Icon } from './Icon';
import { RatingRow } from './RatingRow';
import { VerifiedBadge } from './VerifiedBadge';

const HEART_PX = 20;
const DEFAULT_SIZES = '(min-width: 1128px) 33vw, (min-width: 744px) 50vw, 100vw';

interface ListingCardProps {
  href: string;
  title: string;
  photo?: string;
  photoAlt: string;
  /** "Verified" or "Community verified". Omitted for a host with no badge. */
  badge?: string;
  /** Town and duration, e.g. "Langa, Cape Town · 2 hours". */
  meta: string;
  /** "Hosted by Nomsa". Travellers choose a person, so the person is on the card. */
  host: string;
  hostPortrait?: string;
  rating: number | null;
  ratingCount: number;
  ratingLabel?: string;
  newLabel: string;
  /** "From R350". */
  price: string;
  /** "per person" or "for the group". */
  priceUnit: string;
  /** The heart shows only when there is somewhere to save to. */
  saved?: boolean;
  saveLabel?: string;
  onToggleSave?: () => void;
  priority?: boolean;
  sizes?: string;
}

/**
 * DESIGN.md listing-card: photo first, no border, the badge lifted off the photo, a heart in a white circle.
 * Plain props only, so the database-backed feed and the prototype catalogue draw the same card.
 */
export const ListingCard = ({
  href,
  title,
  photo,
  photoAlt,
  badge,
  meta,
  host,
  hostPortrait,
  rating,
  ratingCount,
  ratingLabel,
  newLabel,
  price,
  priceUnit,
  saved = false,
  saveLabel,
  onToggleSave,
  priority = false,
  sizes = DEFAULT_SIZES,
}: ListingCardProps) => (
  <div className="relative">
    <Link href={href} className="flex flex-col gap-3 text-ink no-underline active:opacity-80">
      <div className="relative aspect-4/3 overflow-hidden rounded-md bg-surface-soft">
        {photo ? <Image src={photo} alt={photoAlt} fill priority={priority} className="object-cover" sizes={sizes} /> : null}
        {badge ? (
          <span className="absolute left-3 top-3">
            <VerifiedBadge label={badge} floating density="traveller" />
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-title-sm text-ink">{title}</h3>
        <p className="text-body-sm text-muted">{meta}</p>
        <p className="flex items-center gap-2 text-body-sm text-muted">
          {hostPortrait ? (
            <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-surface-strong">
              <Image src={hostPortrait} alt="" fill className="object-cover" sizes="24px" />
            </span>
          ) : null}
          {host}
        </p>
        <div className="flex items-baseline justify-between gap-3 pt-1">
          <RatingRow rating={rating} count={ratingCount} newLabel={newLabel} label={ratingLabel} />
          <p className="text-body-sm text-muted">
            <span className="text-title-sm text-ink">{price}</span> {priceUnit}
          </p>
        </div>
      </div>
    </Link>
    {onToggleSave ? (
      <button type="button" aria-pressed={saved} aria-label={saveLabel} onClick={onToggleSave} className="absolute right-1 top-1 flex size-12 items-center justify-center">
        <span className="flex size-9 items-center justify-center rounded-full bg-canvas text-ink shadow-lift">
          {/* Saved is a filled heart, not a colour change: the shape carries the state. */}
          <Icon name="heart" size={HEART_PX} className={saved ? 'fill-current' : ''} />
        </span>
      </button>
    ) : null}
  </div>
);
