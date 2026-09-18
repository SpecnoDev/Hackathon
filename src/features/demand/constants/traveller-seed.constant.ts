import type { GuestDetails, Trip, TravellerAppState } from '../interfaces';
import { HOST_RESPONSE_HOURS } from '@/core/constants';
import { MS_PER_DAY, MS_PER_HOUR, TRAVELLER_APP_SCHEMA_VERSION } from './traveller-limits.constant';

const GUEST: GuestDetails = { name: 'Lerato Mokoena', phone: '+27821234567', whatsAppOptIn: true, language: 'EN' };

/**
 * One traveller, Lerato, with a trip in every state so each screen has something real to show:
 * confirmed, waiting for the host, cancelled with a refund, finished and waiting for a review, and finished and reviewed.
 */
export const createTravellerSeed = (now: Date): TravellerAppState => {
  const day = (offset: number): string => new Date(now.getTime() + offset * MS_PER_DAY).toISOString().slice(0, 10);
  const at = (offsetDays: number): string => new Date(now.getTime() + offsetDays * MS_PER_DAY).toISOString();
  const trip = (id: string, listingId: string, status: Trip['status'], dayOffset: number, time: string | null, guests: number, subtotalCents: number, extra: Partial<Trip> = {}): Trip => ({
    id,
    listingId,
    status,
    date: day(dayOffset),
    time,
    guests,
    subtotalCents,
    serviceFeeCents: 0,
    totalCents: subtotalCents,
    paymentMethod: 'CARD',
    guest: GUEST,
    createdAt: at(Math.min(dayOffset, 0) - 6),
    reviewed: false,
    ...extra,
  });

  return {
    schemaVersion: TRAVELLER_APP_SCHEMA_VERSION,
    profile: {
      signedIn: true,
      firstName: 'Lerato',
      phone: GUEST.phone,
      language: 'EN',
      showApproxCurrency: false,
      approxCurrency: 'USD',
      notifications: { bookings: true, reminders: true, reviews: true },
    },
    signIn: {},
    search: { guests: 2, query: '', recent: ['Soweto', 'Somewhere to eat real food in Durban'] },
    filters: { verifiedOnly: false, instantOnly: false },
    savedIds: ['lst-knysna-forest', 'lst-montagu-lunch', 'lst-karoo-stars'],
    trips: [
      trip('trip-bokaap', 'lst-bokaap-spice', 'CONFIRMED', 3, '09:30', 2, 56_000),
      trip('trip-karoo-farm', 'off-karoo-farm', 'REQUESTED', 9, '06:00', 4, 200_000, {
        createdAt: new Date(now.getTime() - MS_PER_HOUR).toISOString(),
        respondBy: new Date(now.getTime() + (HOST_RESPONSE_HOURS - 1) * MS_PER_HOUR).toISOString(),
      }),
      trip('trip-durban-bunny', 'lst-durban-bunny', 'CANCELLED', 6, '11:30', 2, 50_000, { cancelledAt: at(-1), cancelReason: 'PLANS_CHANGED', refundCents: 50_000 }),
      trip('trip-soweto', 'lst-soweto-on-foot', 'COMPLETED', -12, '09:00', 2, 60_000),
      trip('trip-langa-lunch', 'off-langa-lunch', 'COMPLETED', -30, '13:00', 4, 60_000, { reviewed: true }),
    ],
    plans: [
      {
        id: 'plan-garden-route',
        name: 'Garden Route December',
        items: [
          { id: 'item-1', listingId: 'lst-montagu-lunch', day: 1 },
          { id: 'item-2', listingId: 'lst-knysna-forest', day: 2 },
          { id: 'item-3', listingId: 'lst-knysna-supper', day: 2 },
        ],
      },
    ],
    reviews: [],
  };
};
