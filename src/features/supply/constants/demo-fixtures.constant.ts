import { hostReceivesCents, maskPhone, platformFeeCents } from '@/shared/utils';
import type { Availability, Booking, BookingStatus, GroupPayment, Offering, OfferingPhoto, Payout, PayoutStatus } from '../interfaces';
import { DEMO_LANGUAGE, DEMO_LISTING_KIND, DEMO_PHONE_LOCAL, DEMO_REGION } from './demo.constant';
import { DEMO_PAYOUT_DELAY_MS, MS_PER_DAY, MS_PER_HOUR, PAYOUT_WINDOW_HOURS, RESPONSE_DEADLINE_HOURS } from './host-limits.constant';
import { kindOption } from './host-options.constant';
import { LISTING_SAMPLES } from './listing-samples.constant';

/**
 * Every fixture booking/payout id carries this prefix, so the store (host-app.store.ts) can tell a
 * demo fixture apart from a real, server-synced row at a glance — no separate flag needed to know
 * what to keep across a sync, or what a booking action must never send to the API.
 */
export const DEMO_FIXTURE_PREFIX = 'demo-';

const at = (days: number, hour: number): string => {
  const date = new Date(Date.now() + days * MS_PER_DAY);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};
const inHours = (hours: number): string => new Date(Date.now() + hours * MS_PER_HOUR).toISOString();
const inMs = (ms: number): string => new Date(Date.now() + ms).toISOString();

const DEMO_OFFERING_AVAILABILITY: Availability = { type: 'ON_REQUEST', dates: [], weekdays: [] };

/**
 * The one LIVE listing a cold demo deep link needs before there is anything for `buildDemoBookings`
 * to attach to (host-app.store.ts, seedDemoOfferingIfNeeded — deliberately separate from
 * seedDemoFixturesIfNeeded, so a real Join → Create → Publish run still starts from zero offerings).
 * Built straight from LISTING_SAMPLES, the same source a real drafted listing uses, with `photos`
 * supplied by the caller once it has actually stored them (see loadDemoOfferingPhotos) — a plain
 * `DEMO_LISTING_PHOTOS` URL is not a blob-store key and would render as a broken photo everywhere
 * else in the app that reads `photos[0].key`.
 */
export const buildDemoOffering = (hostId: string, photos: OfferingPhoto[]): Offering => {
  const sample = LISTING_SAMPLES[DEMO_LISTING_KIND];
  const createdAt = inHours(-1);
  return {
    ...sample.fields,
    kind: DEMO_LISTING_KIND,
    id: `${DEMO_FIXTURE_PREFIX}offering-${hostId}`,
    hostId,
    category: kindOption(DEMO_LISTING_KIND).category,
    sourceLanguage: DEMO_LANGUAGE,
    region: DEMO_REGION,
    photos,
    availability: DEMO_OFFERING_AVAILABILITY,
    transcript: sample.transcript.EN,
    status: 'LIVE',
    statusReason: undefined,
    views: 0,
    pendingSync: false,
    createdAt,
    updatedAt: createdAt,
  };
};

const totalCentsFor = (offering: Offering, groupSize: number): number =>
  offering.priceUnit === 'PER_PERSON' ? offering.priceCents * groupSize : offering.priceCents;

const fullGroupPayment = (groupSize: number): GroupPayment => ({ paid: groupSize, of: groupSize });

interface BookingSeed {
  suffix: string;
  travellerName: string;
  status: BookingStatus;
  daysFromNow: number;
  hour: number;
  groupSize: number;
  offeringIndex: number;
}

/**
 * A request still to answer, two upcoming, two already done — fills every section of the Bookings
 * tab and gives Earnings a completed booking to pay out. `offeringIndex` cycles modulo the host's
 * own offering count, so this reads fine whether the host has published one listing or several.
 */
const BOOKING_SEEDS: BookingSeed[] = [
  { suffix: 'request', travellerName: 'Amara', status: 'REQUESTED', daysFromNow: 2, hour: 11, groupSize: 2, offeringIndex: 0 },
  { suffix: 'upcoming-1', travellerName: 'Pieter', status: 'CONFIRMED', daysFromNow: 4, hour: 14, groupSize: 3, offeringIndex: 1 },
  { suffix: 'upcoming-2', travellerName: 'Lindiwe', status: 'CONFIRMED', daysFromNow: 6, hour: 9, groupSize: 1, offeringIndex: 0 },
  { suffix: 'done-1', travellerName: 'Naledi', status: 'COMPLETED', daysFromNow: -10, hour: 10, groupSize: 2, offeringIndex: 1 },
  { suffix: 'done-2', travellerName: 'Sam', status: 'COMPLETED', daysFromNow: -5, hour: 13, groupSize: 4, offeringIndex: 0 },
];

/**
 * 4-6 bookings across the host's own offerings, so a fresh demo host's Bookings tab is never empty
 * the moment they publish their first listing. Returns nothing until there is at least one offering
 * to attach them to — called again once one exists (see host-app.store.ts, seedDemoFixturesIfNeeded).
 */
export const buildDemoBookings = (hostId: string, offerings: Offering[]): Booking[] => {
  if (offerings.length === 0) return [];
  return BOOKING_SEEDS.map(({ suffix, travellerName, status, daysFromNow, hour, groupSize, offeringIndex }) => {
    const offering = offerings[offeringIndex % offerings.length];
    const totalCents = totalCentsFor(offering, groupSize);
    return {
      id: `${DEMO_FIXTURE_PREFIX}bk-${suffix}`,
      offeringId: offering.id,
      hostId,
      travellerName,
      status,
      date: at(daysFromNow, hour),
      groupSize,
      totalCents,
      feeCents: platformFeeCents(totalCents),
      hostReceivesCents: hostReceivesCents(totalCents),
      respondBy: inHours(RESPONSE_DEADLINE_HOURS),
      groupPayment: fullGroupPayment(groupSize),
      pendingSync: false,
      createdAt: inHours(-1),
    };
  });
};

/** Every fixture payout "pays out" to the same canned demo number (see DEMO_PHONE_LOCAL) — masked once. */
const DEMO_PAYOUT_DESTINATION = maskPhone(DEMO_PHONE_LOCAL);

const payoutIdFor = (bookingId: string): string => bookingId.replace(`${DEMO_FIXTURE_PREFIX}bk-`, `${DEMO_FIXTURE_PREFIX}po-`);

/**
 * One payout per COMPLETED demo booking, oldest first: the older one already SENT (PayoutStatus has
 * no separate "PAID" state — SENT is what EarningsCard counts as paid out), the more recent one still
 * PENDING with an autoSendAt a few seconds out, so HostAppProvider's own payout timer flips it to SENT
 * live on stage exactly like a real completeBooking() payout would.
 */
export const buildDemoPayouts = (hostId: string, bookings: Booking[]): Payout[] =>
  bookings
    .filter((booking) => booking.status === 'COMPLETED' && booking.id.startsWith(DEMO_FIXTURE_PREFIX))
    .map((booking, index) => {
      const status: PayoutStatus = index === 0 ? 'SENT' : 'PENDING';
      return {
        id: payoutIdFor(booking.id),
        bookingId: booking.id,
        hostId,
        amountCents: booking.hostReceivesCents,
        channel: 'CASH_SEND',
        destination: DEMO_PAYOUT_DESTINATION,
        status,
        expectedBy: inHours(PAYOUT_WINDOW_HOURS),
        sentAt: status === 'SENT' ? inHours(-1) : undefined,
        autoSendAt: status === 'PENDING' ? inMs(DEMO_PAYOUT_DELAY_MS) : undefined,
      };
    });
