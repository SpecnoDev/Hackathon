'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Icon, ToggleRow, type IconName } from '@/shared/components';
import { DEMO_DECLINED_CARD_ENDING, DEMO_REJECTED_OTP, LISTINGS, PLACES, TRAVELLER_ROUTES } from '../../constants';
import { useTravellerApp } from '../../hooks';
import type { TravellerAppState } from '../../interfaces';
import { travellerAppStore } from '../../services/client';

/** Team tooling, not product: the copy here is for us, so it lives with the page rather than in the traveller copy. */
interface ScreenLink {
  number: string;
  name: string;
  href: string;
}

interface Targets {
  signedIn: boolean;
  approx: boolean;
  confirmedId?: string;
  requestedId?: string;
  cancelledId?: string;
  toReviewId?: string;
  planId?: string;
}

const INSTANT_LISTING = LISTINGS.find((listing) => listing.bookingMode === 'INSTANT') ?? LISTINGS[0];
const REQUEST_LISTING = LISTINGS.find((listing) => listing.bookingMode === 'ON_REQUEST') ?? LISTINGS[0];
const UNREVIEWED_LISTING = LISTINGS.find((listing) => listing.ratings.every((votes) => votes === 0)) ?? LISTINGS[0];

const selectTargets = (state: TravellerAppState): Targets => ({
  signedIn: state.profile.signedIn,
  approx: state.profile.showApproxCurrency,
  confirmedId: state.trips.find((trip) => trip.status === 'CONFIRMED')?.id,
  requestedId: state.trips.find((trip) => trip.status === 'REQUESTED')?.id,
  cancelledId: state.trips.find((trip) => trip.status === 'CANCELLED')?.id,
  toReviewId: state.trips.find((trip) => trip.status === 'COMPLETED' && !trip.reviewed)?.id,
  planId: state.plans[0]?.id,
});

const trip = (id: string | undefined, href: (tripId: string) => string): string => (id ? href(id) : TRAVELLER_ROUTES.trips.list);

const flows = (targets: Targets): Array<{ title: string; note?: string; screens: ScreenLink[] }> => [
  {
    title: 'Traveller flow 1 · Explore',
    screens: [
      { number: 'T1', name: 'Home', href: TRAVELLER_ROUTES.home },
      { number: 'T2', name: 'Search sheet', href: TRAVELLER_ROUTES.search },
      { number: 'T3', name: 'Results', href: TRAVELLER_ROUTES.results },
      { number: 'T3·', name: 'Results with the filter sheet open', href: TRAVELLER_ROUTES.resultsFilters },
      { number: 'T4', name: `Place page (${PLACES[0].name})`, href: TRAVELLER_ROUTES.place(PLACES[0].slug) },
    ],
  },
  {
    title: 'Traveller flow 2 · Listing',
    screens: [
      { number: 'T5', name: 'Listing detail, instant book', href: TRAVELLER_ROUTES.listing(INSTANT_LISTING.id) },
      { number: 'T5·', name: 'Listing detail, request to book', href: TRAVELLER_ROUTES.listing(REQUEST_LISTING.id) },
      { number: 'T5·', name: 'Listing detail, new with no reviews', href: TRAVELLER_ROUTES.listing(UNREVIEWED_LISTING.id) },
      { number: 'T5·', name: 'Share sheet', href: TRAVELLER_ROUTES.listingShare(INSTANT_LISTING.id) },
      { number: 'T6', name: 'All reviews', href: TRAVELLER_ROUTES.listingReviews(INSTANT_LISTING.id) },
      { number: 'T7', name: 'Host profile', href: TRAVELLER_ROUTES.host(INSTANT_LISTING.hostId) },
    ],
  },
  {
    title: 'Traveller flow 3 · Book and pay',
    note: `A card number ending in ${DEMO_DECLINED_CARD_ENDING} is declined, so the error state can be shown. Sign out first to see sign-in at payment.`,
    screens: [
      { number: 'T8', name: 'Choose date and time', href: TRAVELLER_ROUTES.book.date(INSTANT_LISTING.id) },
      { number: 'T8·', name: 'Choose date, host confirms the time', href: TRAVELLER_ROUTES.book.date(REQUEST_LISTING.id) },
      { number: 'T9', name: 'Who is coming', href: TRAVELLER_ROUTES.book.guests(INSTANT_LISTING.id) },
      { number: 'T10', name: 'Review and pay', href: TRAVELLER_ROUTES.book.review(INSTANT_LISTING.id) },
      { number: 'T11', name: 'Payment', href: TRAVELLER_ROUTES.book.pay(INSTANT_LISTING.id) },
      { number: 'T12', name: 'Confirmed', href: trip(targets.confirmedId, TRAVELLER_ROUTES.book.confirmed) },
      { number: 'T12b', name: 'Requested, waiting for the host', href: trip(targets.requestedId, TRAVELLER_ROUTES.book.requested) },
    ],
  },
  {
    title: 'Traveller flow 4 · Trips',
    screens: [
      { number: 'T13', name: 'Trips tab', href: TRAVELLER_ROUTES.trips.list },
      { number: 'T14', name: 'Trip detail, confirmed', href: trip(targets.confirmedId, TRAVELLER_ROUTES.trips.detail) },
      { number: 'T14·', name: 'Trip detail, waiting for the host', href: trip(targets.requestedId, TRAVELLER_ROUTES.trips.detail) },
      { number: 'T14·', name: 'Trip detail, cancelled', href: trip(targets.cancelledId, TRAVELLER_ROUTES.trips.detail) },
      { number: 'T14·', name: 'Trip detail, finished', href: trip(targets.toReviewId, TRAVELLER_ROUTES.trips.detail) },
      { number: 'T15', name: 'Cancel a trip', href: trip(targets.confirmedId, TRAVELLER_ROUTES.trips.cancel) },
      { number: 'T16', name: 'Safety sheet', href: trip(targets.confirmedId, TRAVELLER_ROUTES.trips.safety) },
    ],
  },
  {
    title: 'Traveller flow 5 · Review',
    screens: [
      { number: 'T17', name: 'Rate your trip', href: trip(targets.toReviewId, TRAVELLER_ROUTES.trips.review) },
      { number: 'T18', name: 'Thank you', href: trip(targets.toReviewId, TRAVELLER_ROUTES.trips.reviewThanks) },
    ],
  },
  {
    title: 'Traveller flows 6 to 8 · Saved, plans, account',
    note: `Sign-in is mocked: any code works except ${DEMO_REJECTED_OTP}.`,
    screens: [
      { number: 'T19', name: 'Saved tab', href: TRAVELLER_ROUTES.saved },
      { number: 'T20', name: 'Add to a trip plan (sheet on a listing)', href: TRAVELLER_ROUTES.listingPlan(INSTANT_LISTING.id) },
      { number: 'T20·', name: 'Trip plans', href: TRAVELLER_ROUTES.plans.list },
      { number: 'T20·', name: 'Plan view', href: targets.planId ? TRAVELLER_ROUTES.plans.detail(targets.planId) : TRAVELLER_ROUTES.plans.list },
      { number: 'T21', name: 'Profile tab', href: TRAVELLER_ROUTES.profile },
      { number: 'T22', name: 'Sign in: phone number', href: TRAVELLER_ROUTES.signIn.phone },
      { number: 'T22·', name: 'Sign in: enter the code', href: TRAVELLER_ROUTES.signIn.code },
    ],
  },
];

const notifications = (targets: Targets): Array<{ channel: string; icon: IconName; text: string; href: string }> => [
  { channel: 'WhatsApp', icon: 'message', text: 'Your booking is confirmed. Tap to see where you meet.', href: trip(targets.confirmedId, TRAVELLER_ROUTES.trips.detail) },
  { channel: 'Push', icon: 'bell', text: 'Your host answered your request. Tap to see.', href: trip(targets.requestedId, TRAVELLER_ROUTES.trips.detail) },
  { channel: 'SMS', icon: 'smartphone', text: 'Tomorrow is your trip. Tap for the meeting point.', href: trip(targets.confirmedId, TRAVELLER_ROUTES.trips.detail) },
  { channel: 'WhatsApp', icon: 'message', text: 'How was it? Tap to leave a review.', href: trip(targets.toReviewId, TRAVELLER_ROUTES.trips.review) },
];

/** The traveller half of /flows: demo controls, notification entry points, then every screen by flow. */
export const TravellerFlows = () => {
  const targets = useTravellerApp(selectTargets);

  useEffect(() => {
    void travellerAppStore.hydrate();
  }, []);

  return (
    <>
      <section className="flex flex-col gap-3 border-t border-hairline pt-10">
        <h2 className="font-display text-display-md text-ink">Traveller app</h2>
        <p className="text-caption text-muted">You are Lerato, a traveller from Cape Town. Data is seeded, saved on this device, and survives a reload.</p>
        <ToggleRow icon="user" label="Signed in" checked={targets.signedIn} onLabel="On" offLabel="Off" onChange={(on) => (on ? travellerAppStore.patchProfile({ signedIn: true }) : travellerAppStore.signOut())} />
        <ToggleRow icon="globe" label="Visitor from abroad (show about-prices in dollars)" checked={targets.approx} onLabel="On" offLabel="Off" onChange={(showApproxCurrency) => travellerAppStore.patchProfile({ showApproxCurrency })} />
        {targets.requestedId ? (
          <div className="flex gap-3">
            <Button variant="secondary" size="md" icon="check" onClick={() => travellerAppStore.resolveRequest(targets.requestedId ?? '', true)}>
              Host says yes
            </Button>
            <Button variant="secondary" size="md" icon="x" onClick={() => travellerAppStore.resolveRequest(targets.requestedId ?? '', false)}>
              Host says no
            </Button>
          </div>
        ) : null}
        <Button variant="secondary" icon="retake" onClick={() => void travellerAppStore.resetDemo()}>
          Reset the traveller data
        </Button>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-title-lg text-ink">Traveller notification entry points</h2>
        <ul className="flex flex-col gap-3">
          {notifications(targets).map((notice) => (
            <li key={notice.text}>
              <Link href={notice.href} className="flex items-start gap-3 rounded-lg bg-surface-soft p-4">
                <Icon name={notice.icon} className="mt-0.5 shrink-0 text-ink" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-caption text-muted">{notice.channel}</span>
                  <span className="text-body-md text-ink">{notice.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {flows(targets).map((flow) => (
        <section key={flow.title} className="flex flex-col gap-2">
          <h2 className="text-title-lg text-ink">{flow.title}</h2>
          {flow.note ? <p className="text-caption text-muted">{flow.note}</p> : null}
          <ul className="flex flex-col">
            {flow.screens.map((screen) => (
              <li key={`${screen.number}-${screen.name}`}>
                <Link href={screen.href} className="flex min-h-14 items-center gap-3 border-b border-hairline-soft py-3">
                  <span className="w-10 shrink-0 text-caption text-muted">{screen.number}</span>
                  <span className="min-w-0 flex-1 text-body-md text-ink">{screen.name}</span>
                  <span className="hidden text-caption text-muted tablet:inline">{screen.href}</span>
                  <Icon name="chevron-right" className="shrink-0 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
};
