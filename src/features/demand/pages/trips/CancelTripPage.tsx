'use client';

import { useCallback, useState, type ComponentProps } from 'react';
import { useRouter } from 'next/navigation';
import { FREE_CANCELLATION_WINDOW_HOURS } from '@/core/constants';
import { Banner, Button, OptionTile, useToast } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { ListingSummary, TravellerScreen, TripNotice } from '../../components';
import { CANCEL_REASONS, COPY_TRIPS, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { CancelReason, RefundKind, TravellerAppState } from '../../interfaces';
import { refundFor, selectTrip, travellerAppStore } from '../../services/client';
import { formatDayAndTime } from '../../utils';

const copy = COPY_TRIPS.cancel;
const REFUND_TONE: Record<RefundKind, ComponentProps<typeof Banner>['tone']> = { FULL: 'success', PARTIAL: 'warning', NONE: 'warning' };

/** Screen 15: why, then exactly what comes back, before the one button that cannot be undone. */
export const CancelTripPage = ({ tripId }: { tripId: string }) => {
  const router = useRouter();
  const toast = useToast();
  const found = useTravellerApp(useCallback((state: TravellerAppState) => selectTrip(state, tripId), [tripId]));
  const [reason, setReason] = useState<CancelReason>();
  // The store cancels the trip before the router has left, and that must not flash the "cannot be cancelled" notice.
  const [leaving, setLeaving] = useState(false);
  const tripHref = TRAVELLER_ROUTES.trips.detail(tripId);

  if (!found) {
    return <TripNotice barTitle={COPY_TRIPS.detail.barTitle} message={COPY_TRIPS.detail.notFound} backHref={TRAVELLER_ROUTES.trips.list} backLabel={COPY_TRIPS.backToTrips} />;
  }

  const { trip, listing } = found;
  const isRequest = trip.status === 'REQUESTED';

  if (!leaving && !isRequest && trip.status !== 'CONFIRMED') {
    return (
      <TripNotice
        barTitle={COPY_TRIPS.detail.barTitle}
        title={copy.notCancellable.title}
        message={copy.notCancellable.message}
        backHref={tripHref}
        backLabel={COPY_TRIPS.backToTrip}
      />
    );
  }

  const refund = refundFor(trip, new Date());
  const terms = copy.refund[refund.kind];
  const outcome = isRequest
    ? { tone: 'info' as const, ...copy.notCharged }
    : { tone: REFUND_TONE[refund.kind], title: terms.title(formatRand(refund.cents)), why: terms.why(FREE_CANCELLATION_WINDOW_HOURS, formatRand(trip.totalCents)) };

  const confirm = (): void => {
    if (!reason) return;
    setLeaving(true);
    travellerAppStore.cancelTrip(trip.id, reason);
    toast(isRequest ? copy.requestCancelled : copy.tripCancelled);
    router.replace(tripHref);
  };

  return (
    <TravellerScreen
      barTitle={COPY_TRIPS.detail.barTitle}
      backHref={tripHref}
      heading={copy.heading}
      helper={copy.helper}
      width="column"
      footer={
        <>
          <Button size="md" variant="destructive" onClick={confirm} disabled={!reason || leaving}>
            {isRequest ? COPY_TRIPS.cancelRequest : COPY_TRIPS.cancelTrip}
          </Button>
          <Button size="md" variant="secondary" href={tripHref}>
            {isRequest ? copy.keepRequest : copy.keepTrip}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-8">
        <ListingSummary listing={listing}>
          <p className="text-body-sm text-ink">{formatDayAndTime(trip.date, trip.time)}</p>
        </ListingSummary>

        <div role="radiogroup" aria-label={copy.heading} className="flex flex-col gap-3">
          {CANCEL_REASONS.map((option) => (
            <OptionTile key={option} title={copy.reasons[option]} selected={reason === option} onSelect={() => setReason(option)} />
          ))}
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-title-lg text-ink">{copy.getBack}</h2>
          <Banner tone={outcome.tone}>
            <p className="text-title-sm">{outcome.title}</p>
            <p>{outcome.why}</p>
          </Banner>
        </section>
      </div>
    </TravellerScreen>
  );
};
