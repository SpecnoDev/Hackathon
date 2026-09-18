'use client';

import { ListingCard } from '@/shared/components';
import type { OfferingSummary } from '@/shared/dto';
import { toListingCardProps } from '../utils';
import { useSavedListings } from './SavedListingsProvider';

interface ListingCardLinkProps {
  offering: OfferingSummary;
  priority?: boolean;
  sizes?: string;
}

/** The real, database-backed listing card: the shared plain-props `ListingCard`, wired to this traveller's saved state. */
export const ListingCardLink = ({ offering, priority, sizes }: ListingCardLinkProps) => {
  const { savedIds, toggleSaved } = useSavedListings();
  return <ListingCard {...toListingCardProps(offering, savedIds.has(offering.id), () => toggleSaved(offering.id))} priority={priority} sizes={sizes} />;
};
