'use client';

import { useCallback } from 'react';
import { HOST_RESPONSE_HOURS } from '@/core/constants';
import { Banner, Button } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { DetailFact, ListingSummary, TravellerScreen, TripNotice } from '../../components';
import { COPY_BOOK, COPY_COMMON, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { TravellerAppState } from '../../interfaces';
import { hostOf, selectTrip } from '../../services/client';
import { formatClockTime, formatDayAndTime } from '../../utils';

const copy = COPY_BOOK.requested;

/** Screen 12b. A request is waiting on the host: how long they have, what happens if they are silent, and that no money has moved. */
export const BookingRequestedPage = ({ tripId }: { tripId: string }) => {
  const found = useTravellerApp(useCallback((state: TravellerAppState) => selectTrip(state, tripId), [tripId]));

  if (!found) return <TripNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.trip} backHref={TRAVELLER_ROUTES.trips.list} backLabel={COPY_BOOK.viewTrips} />;

  const { trip, listing } = found;
  if (trip.status !== 'REQUESTED') return <TripNotice barTitle={COPY_BOOK.flowTitle} {...COPY_BOOK.notice.changed} backHref={TRAVELLER_ROUTES.trips.detail(trip.id)} />;

  const host = hostOf(listing).firstName;

  return (
    <TravellerScreen
      barTitle={COPY_BOOK.flowTitle}
      heading={copy.title(host)}
      helper={copy.helper}
      width="column"
      footer={
        <>
          <Button size="md" href={TRAVELLER_ROUTES.trips.list}>
            {COPY_BOOK.viewTrips}
          </Button>
          <Button size="md" variant="secondary" href={TRAVELLER_ROUTES.home}>
            {copy.explore}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <Banner tone="warning" icon="clock">
          <p>{copy.deadline(host, COPY_COMMON.hours(HOST_RESPONSE_HOURS))}</p>
          {trip.respondBy ? <p>{copy.until(formatClockTime(trip.respondBy))}</p> : null}
        </Banner>

        <ul className="flex flex-col gap-5">
          <DetailFact icon="calendar-x" title={copy.noAnswerTitle}>
            {copy.noAnswer}
          </DetailFact>
          <DetailFact icon="banknote" title={copy.notChargedTitle}>
            {copy.notCharged(formatRand(trip.totalCents), host)}
          </DetailFact>
        </ul>

        <div className="border-t border-hairline-soft pt-6">
          <ListingSummary listing={listing}>
            <p className="text-body-sm text-muted">{COPY_BOOK.summary(formatDayAndTime(trip.date, trip.time), COPY_COMMON.guests(trip.guests))}</p>
          </ListingSummary>
        </div>
      </div>
    </TravellerScreen>
  );
};
