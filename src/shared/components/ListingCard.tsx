import Image from 'next/image';
import Link from 'next/link';
import type { OfferingSummary } from '@/shared/dto';
import { formatRand } from '@/shared/utils';

const CATEGORY_LABEL: Record<OfferingSummary['category'], string> = {
  TOUR: 'Tour',
  FOOD: 'Food experience',
  TRANSPORT: 'Transport',
  ACCOMMODATION: 'Accommodation',
  CONCIERGE: 'Concierge',
  SECURITY: 'Security',
};

const durationLabel = (durationMin: number | null): string | null => {
  if (durationMin === null) return null;
  if (durationMin < 60) return `${durationMin} min`;
  const hours = durationMin / 60;
  return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hours`;
};

export function ListingCard({ offering }: { offering: OfferingSummary }) {
  const duration = durationLabel(offering.durationMin);
  const isVerified = offering.hostTier === 'IDENTITY' || offering.hostTier === 'COMMUNITY';
  const verifiedLabel = offering.hostTier === 'COMMUNITY' ? 'Community verified' : 'Verified';

  return (
    <Link
      href={`/listings/${offering.id}`}
      className="flex flex-col rounded-md bg-canvas text-ink no-underline"
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-md bg-surface-soft">
        {offering.photos[0] && (
          <Image
            src={offering.photos[0]}
            alt={offering.title}
            fill
            className="object-cover"
            sizes="(min-width: 1128px) 33vw, (min-width: 744px) 50vw, 100vw"
          />
        )}
        {isVerified && (
          <span className="absolute left-2 top-2 rounded-full bg-primary-tint px-2.5 py-1 text-badge font-[var(--text-badge--font-weight)] text-primary-text shadow-lift">
            ✓ {verifiedLabel}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 pt-3">
        <h3 className="text-title-sm text-ink">{offering.title}</h3>
        <p className="text-body-sm text-muted">
          {offering.town} · {CATEGORY_LABEL[offering.category]}
          {duration ? ` · ${duration}` : ''}
        </p>

        <div className="flex items-center gap-1 text-caption text-ink">
          {offering.avgRating !== null ? (
            <>
              <span className="text-star-rating">★</span>
              <span>{offering.avgRating.toFixed(1)}</span>
              <span className="text-muted">({offering.reviewCount})</span>
            </>
          ) : (
            <span className="text-muted">New listing</span>
          )}
          {offering.vouchCount > 0 && (
            <span className="text-muted">
              · {offering.vouchCount} local{offering.vouchCount === 1 ? '' : 's'} recommend
            </span>
          )}
        </div>

        <p className="text-title-sm text-ink">
          From {formatRand(offering.priceCents)} <span className="text-body-sm text-muted">per person</span>
        </p>
      </div>
    </Link>
  );
}
