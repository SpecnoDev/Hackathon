'use client';

import { useCallback } from 'react';
import { Button, Icon } from '@/shared/components';
import { TravellerScreen, TripNotice } from '../../components';
import { COPY_TRIPS, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { TravellerAppState } from '../../interfaces';
import { hostOf, selectTrip } from '../../services/client';

const RESULT_ICON_PX = 48;
const copy = COPY_TRIPS.thanks;
const selectFirstName = (state: TravellerAppState): string => state.profile.firstName;

/** Screen 18. Guarded against a missing trip only, so the team's flows page can open it without sending a review first. */
export const ReviewThanksPage = ({ tripId }: { tripId: string }) => {
  const found = useTravellerApp(useCallback((state: TravellerAppState) => selectTrip(state, tripId), [tripId]));
  const firstName = useTravellerApp(selectFirstName);

  if (!found) {
    return <TripNotice barTitle={COPY_TRIPS.review.barTitle} message={COPY_TRIPS.detail.notFound} backHref={TRAVELLER_ROUTES.trips.list} backLabel={COPY_TRIPS.backToTrips} />;
  }

  return (
    <TravellerScreen
      barTitle={COPY_TRIPS.review.barTitle}
      width="column"
      footer={
        <>
          <Button size="md" href={TRAVELLER_ROUTES.home}>
            {copy.explore}
          </Button>
          <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.trips.list}>
            {COPY_TRIPS.backToTrips}
          </Button>
        </>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-accent-tint text-ink">
          <Icon name="star" size={RESULT_ICON_PX} />
        </span>
        <h1 className="font-display text-display-lg text-ink">{copy.title(firstName)}</h1>
        <p className="text-body-md text-body">{copy.body(hostOf(found.listing).firstName)}</p>
      </div>
    </TravellerScreen>
  );
};
