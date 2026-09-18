import type { ComponentProps } from 'react';
import { ListingCard } from '@/shared/components';
import type { OfferingSummary } from '@/shared/dto';
import { formatRand } from '@/shared/utils';
import { COPY_COMMON, TRAVELLER_ROUTES } from '../constants';
import { formatDuration } from './format-duration.util';

type ListingCardProps = ComponentProps<typeof ListingCard>;

/** The one place an `OfferingSummary` becomes the shared, plain-props `ListingCard` — every rail, grid and saved list goes through this. */
export const toListingCardProps = (
  offering: OfferingSummary,
  saved: boolean,
  onToggleSave?: () => void,
): ListingCardProps => ({
  href: TRAVELLER_ROUTES.listing(offering.id),
  title: offering.title,
  photo: offering.photos[0],
  photoAlt: offering.title,
  badge: offering.hostTier === 'REGISTERED' ? undefined : COPY_COMMON.badge[offering.hostTier],
  meta: [offering.town, formatDuration(offering.durationMin)].filter(Boolean).join(' · '),
  host: COPY_COMMON.hostedBy(offering.hostFirstName),
  rating: offering.avgRating,
  ratingCount: offering.reviewCount,
  ratingLabel: offering.avgRating === null ? undefined : COPY_COMMON.ratingLabel(offering.avgRating.toFixed(1), offering.reviewCount),
  newLabel: COPY_COMMON.isNew,
  price: COPY_COMMON.from(formatRand(offering.priceCents)),
  priceUnit: COPY_COMMON.priceUnit[offering.priceUnit],
  saved,
  saveLabel: saved ? COPY_COMMON.saved.remove(offering.title) : COPY_COMMON.saved.add(offering.title),
  onToggleSave,
});
