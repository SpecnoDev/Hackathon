'use client';

import { useCallback } from 'react';
import { ListingCard, useToast } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { COPY_COMMON, TRAVELLER_ROUTES } from '../constants';
import { useTravellerApp } from '../hooks';
import type { Listing, TravellerAppState } from '../interfaces';
import { badgeFor, hostOf, ratingOf, selectIsSaved, travellerAppStore } from '../services/client';
import { formatDuration } from '../utils';

/** The shared listing card, wired to this traveller: where it goes, whether it is saved, and what a tap on the heart does. */
export const ListingCardLink = ({ listing, priority = false, sizes }: { listing: Listing; priority?: boolean; sizes?: string }) => {
  const toast = useToast();
  const saved = useTravellerApp(useCallback((state: TravellerAppState) => selectIsSaved(state, listing.id), [listing.id]));
  const host = hostOf(listing);
  const rating = ratingOf(listing);

  return (
    <ListingCard
      href={TRAVELLER_ROUTES.listing(listing.id)}
      title={listing.title}
      photo={listing.photos[0]}
      photoAlt={listing.title}
      badge={badgeFor(host)}
      meta={[listing.town, formatDuration(listing.durationMin)].join(' · ')}
      host={COPY_COMMON.hostedBy(host.firstName)}
      hostPortrait={host.portrait}
      rating={rating.average}
      ratingCount={rating.count}
      ratingLabel={rating.average === null ? undefined : COPY_COMMON.ratingLabel(rating.average.toFixed(1), rating.count)}
      newLabel={COPY_COMMON.isNew}
      price={COPY_COMMON.from(formatRand(listing.priceCents))}
      priceUnit={COPY_COMMON.priceUnit[listing.priceUnit]}
      saved={saved}
      saveLabel={saved ? COPY_COMMON.saved.remove(listing.title) : COPY_COMMON.saved.add(listing.title)}
      onToggleSave={() => toast(travellerAppStore.toggleSaved(listing.id) ? COPY_COMMON.saved.added : COPY_COMMON.saved.removed)}
      priority={priority}
      sizes={sizes}
    />
  );
};
