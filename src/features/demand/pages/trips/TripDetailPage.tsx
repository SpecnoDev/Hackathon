'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { Banner, Button, Icon, useToast, type IconName } from '@/shared/components';
import { formatRand, whatsAppLink } from '@/shared/utils';
import { DetailFact, ListingSummary, PlanPickerSheet, SafetySheet, ShareSheet, TravellerScreen, TripNotice, TripStatusPill } from '../../components';
import { COPY_COMMON, COPY_EXPLORE, COPY_TRIPS, SUPPORT_WHATSAPP_NUMBER, TRAVELLER_ROUTES, type TravellerSheet } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { TravellerAppState } from '../../interfaces';
import { hostOf, isUpcoming, selectTrip, travellerAppStore } from '../../services/client';
import { formatClockTime, formatDayAndTime } from '../../utils';

const GOOGLE_MAPS_SEARCH = 'https://www.google.com/maps/search/?api=1&query=';
const ROW = 'flex min-h-14 w-full items-center gap-4 border-b border-hairline-soft py-3 text-left text-title-sm text-ink active:bg-surface-soft disabled:text-muted';
const copy = COPY_TRIPS.detail;

interface ActionRowProps {
  icon: IconName;
  label: string;
  href?: string;
  /** Leaves the app, so it opens beside the trip instead of replacing it. */
  external?: boolean;
  /** Already done: the row stays, with a check where the chevron was, and can no longer be tapped. */
  done?: boolean;
  onClick?: () => void;
}

/** A quiet row rather than a button: each trip state keeps one loud action, and it lives in the footer. */
const ActionRow = ({ icon, label, href, external = false, done = false, onClick }: ActionRowProps) => {
  const body = (
    <>
      <Icon name={icon} className="shrink-0" />
      <span className="flex-1">{label}</span>
      <Icon name={done ? 'check' : 'chevron-right'} className="shrink-0 text-muted" />
    </>
  );
  return (
    <li>
      {href ? (
        <Link href={href} className={ROW} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {body}
        </Link>
      ) : (
        <button type="button" disabled={done} onClick={onClick} className={ROW}>
          {body}
        </button>
      )}
    </li>
  );
};

/** Screen 14: the trip as a receipt, then what this state allows. Safety is on every state; cancelling sits last, never in the footer. */
export const TripDetailPage = ({ tripId, openSafety = false }: { tripId: string; openSafety?: boolean }) => {
  const toast = useToast();
  const found = useTravellerApp(useCallback((state: TravellerAppState) => selectTrip(state, tripId), [tripId]));
  const [sheet, setSheet] = useState<TravellerSheet | undefined>(openSafety ? 'safety' : undefined);

  if (!found) return <TripNotice barTitle={copy.barTitle} message={copy.notFound} backHref={TRAVELLER_ROUTES.trips.list} backLabel={COPY_TRIPS.backToTrips} />;

  const { trip, listing } = found;
  const host = hostOf(listing);
  const now = new Date();
  const when = formatDayAndTime(trip.date, trip.time);
  const requested = trip.status === 'REQUESTED';
  const confirmed = trip.status === 'CONFIRMED';
  const changeable = confirmed && isUpcoming(trip, now);
  const toReview = trip.status === 'COMPLETED' && !trip.reviewed;
  // A saved request can outlive its deadline, and a clock time that has passed would read as later today.
  const deadline = trip.respondBy && new Date(trip.respondBy) > now ? formatClockTime(trip.respondBy) : undefined;
  // Only the traveller gives a reason, so a cancelled trip without one was turned down by the host before anything was charged.
  const cancelledNote = trip.refundCents ? copy.refundOnItsWay(formatRand(trip.refundCents)) : trip.cancelReason ? copy.noRefund : copy.declined(host.firstName);
  const closeSheet = (): void => setSheet(undefined);

  const askToReschedule = (): void => {
    travellerAppStore.requestReschedule(trip.id);
    toast(copy.rescheduleToast(host.firstName));
  };

  const footer = confirmed ? (
    // TODO: hosts have no public number in the data yet, so this opens a chat with support instead of the host.
    <Button size="md" icon="message" href={whatsAppLink(SUPPORT_WHATSAPP_NUMBER, copy.hostMessage(host.firstName, listing.title, when))}>
      {copy.messageHost(host.firstName)}
    </Button>
  ) : toReview ? (
    <Button size="md" icon="star" href={TRAVELLER_ROUTES.trips.review(trip.id)}>
      {COPY_TRIPS.leaveReview}
    </Button>
  ) : requested ? undefined : (
    <Button size="md" href={TRAVELLER_ROUTES.listing(listing.id)}>
      {copy.bookAgain}
    </Button>
  );

  return (
    <TravellerScreen barTitle={copy.barTitle} backHref={TRAVELLER_ROUTES.trips.list} width="column" footer={footer}>
      <div className="flex flex-col gap-8">
        <h1 className="sr-only">{listing.title}</h1>
        <ListingSummary listing={listing}>
          <div className="pt-1">
            <TripStatusPill status={trip.status} />
          </div>
        </ListingSummary>

        {requested ? (
          <Banner tone="warning" icon="clock">
            {copy.waiting(host.firstName, deadline)}
          </Banner>
        ) : null}
        {changeable && trip.rescheduleRequested ? (
          <Banner tone="info" icon="clock">
            {copy.rescheduleBanner(host.firstName)}
          </Banner>
        ) : null}
        {trip.status === 'COMPLETED' && trip.reviewed ? <Banner tone="success">{copy.reviewed}</Banner> : null}
        {trip.status === 'CANCELLED' ? <Banner tone={trip.refundCents ? 'success' : 'info'}>{cancelledNote}</Banner> : null}

        <ul className="flex flex-col gap-6">
          <DetailFact icon="calendar" title={copy.when}>
            <p>{when}</p>
            {trip.time ? null : <p className="text-muted">{copy.timeToConfirm}</p>}
          </DetailFact>
          <DetailFact icon="users" title={copy.guests}>
            {COPY_COMMON.guests(trip.guests)}
          </DetailFact>
          <DetailFact icon="banknote" title={copy.total}>
            <p>{formatRand(trip.totalCents)}</p>
            {trip.status === 'CANCELLED' && trip.refundCents ? <p>{copy.refund(formatRand(trip.refundCents))}</p> : null}
          </DetailFact>
          <DetailFact icon="map-pin" title={copy.meet}>
            <p>{listing.meetingPoint}</p>
            <p className="text-muted">{listing.town}</p>
          </DetailFact>
          <DetailFact icon="user" title={copy.host}>
            <p>{host.firstName}</p>
            <Link href={TRAVELLER_ROUTES.host(host.id)} className="flex min-h-12 items-center text-link text-primary-text underline">
              {COPY_EXPLORE.listing.seeProfile(host.firstName)}
            </Link>
          </DetailFact>
        </ul>

        <ul className="flex flex-col border-t border-hairline-soft">
          {confirmed ? (
            <ActionRow icon="navigation" label={copy.directions} href={`${GOOGLE_MAPS_SEARCH}${encodeURIComponent(`${listing.meetingPoint}, ${listing.town}`)}`} external />
          ) : null}
          {confirmed || requested ? <ActionRow icon="share" label={copy.share} onClick={() => setSheet('share')} /> : null}
          {changeable ? (
            <>
              <ActionRow icon="calendar" label={trip.rescheduleRequested ? copy.rescheduleAsked : copy.reschedule} done={trip.rescheduleRequested} onClick={askToReschedule} />
              <ActionRow icon="route" label={COPY_EXPLORE.plan.title} onClick={() => setSheet('plan')} />
            </>
          ) : null}
          {toReview ? <ActionRow icon="retake" label={copy.bookAgain} href={TRAVELLER_ROUTES.listing(listing.id)} /> : null}
          <ActionRow icon="shield-check" label={copy.safety} onClick={() => setSheet('safety')} />
        </ul>

        {changeable || requested ? (
          <Button size="md" variant="destructive" href={TRAVELLER_ROUTES.trips.cancel(trip.id)}>
            {requested ? COPY_TRIPS.cancelRequest : COPY_TRIPS.cancelTrip}
          </Button>
        ) : null}
      </div>

      {sheet === 'share' ? <ShareSheet path={TRAVELLER_ROUTES.trips.detail(trip.id)} message={copy.shareMessage(listing.title, when)} onClose={closeSheet} /> : null}
      {sheet === 'plan' ? <PlanPickerSheet listingId={listing.id} tripId={trip.id} onClose={closeSheet} /> : null}
      {sheet === 'safety' ? <SafetySheet trip={trip} listing={listing} onClose={closeSheet} /> : null}
    </TravellerScreen>
  );
};
