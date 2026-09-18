'use client';

import { ListingCard } from '@/shared/components';
import type { OfferingSummary } from '@/shared/dto';
import { toListingCardProps } from '../utils';

interface ListingCardLinkProps {
  offering: OfferingSummary;
  saved: boolean;
  onToggleSave: (offeringId: string) => void;
  priority?: boolean;
  sizes?: string;
}

/** The real, database-backed listing card: same plain-props `ListingCard`, wired to this traveller's saved state. */
export const ListingCardLink = ({ offering, saved, onToggleSave, priority, sizes }: ListingCardLinkProps) => (
  <ListingCard
    {...toListingCardProps(offering, saved, () => onToggleSave(offering.id))}
    priority={priority}
    sizes={sizes}
  />
);
