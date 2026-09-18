'use client';

import { useCallback } from 'react';
import { Button, EmptyState } from '@/shared/components';
import { ListingSummary, RatingBreakdown, ReviewCard, TravellerScreen } from '../../components';
import { COPY_COMMON, COPY_EXPLORE, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { Review, TravellerAppState } from '../../interfaces';
import { findListing, reviewsFor } from '../../services/client';

const copy = COPY_EXPLORE;

/** Screen 6: how the votes fall, then every review, newest first. */
export const AllReviewsPage = ({ listingId }: { listingId: string }) => {
  const listing = findListing(listingId);
  const reviews = useTravellerApp(useCallback((state: TravellerAppState): Review[] => reviewsFor(state, listingId), [listingId]));
  const backHref = listing ? TRAVELLER_ROUTES.listing(listing.id) : TRAVELLER_ROUTES.home;

  if (!listing || reviews.length === 0) {
    return (
      <TravellerScreen barTitle={copy.reviews.title} backHref={backHref} width="column">
        <EmptyState
          illustration="missing"
          title={listing ? copy.listing.noReviewsTitle : COPY_COMMON.notFoundTitle}
          message={listing ? copy.listing.noReviews : copy.listing.notFound}
          action={
            <Button size="md" variant="secondary" href={backHref}>
              {listing ? COPY_COMMON.back : copy.listing.backToExplore}
            </Button>
          }
        />
      </TravellerScreen>
    );
  }

  return (
    <TravellerScreen barTitle={copy.reviews.title} backHref={backHref} width="column">
      <div className="flex flex-col gap-8">
        <ListingSummary listing={listing} />
        <RatingBreakdown listing={listing} />
        <ul className="flex flex-col gap-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ul>
      </div>
    </TravellerScreen>
  );
};
