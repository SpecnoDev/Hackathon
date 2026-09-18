import type { Booking, Host, HostAppState, Offering, Payout } from '../interfaces';

const byDateAscending = (a: Booking, b: Booking): number => a.date.localeCompare(b.date);
const byDateDescending = (a: Booking, b: Booking): number => b.date.localeCompare(a.date);
const sumCents = (amounts: number[]): number => amounts.reduce((total, amount) => total + amount, 0);

export const selectHost = (state: HostAppState): Host => state.hosts.find((host) => host.id === state.activeHostId) ?? state.hosts[0];

/** False on a fresh device, or once `resetDemo()` has run, until registration or `switchPersona()` signs someone in. */
export const selectIsSignedIn = (state: HostAppState): boolean => state.hosts.some((host) => host.id === state.activeHostId);

export const selectOfferings = (state: HostAppState): Offering[] => state.offerings.filter((offering) => offering.hostId === state.activeHostId);

export const selectBookings = (state: HostAppState): Booking[] => state.bookings.filter((booking) => booking.hostId === state.activeHostId);

export const selectPayouts = (state: HostAppState): Payout[] => state.payouts.filter((payout) => payout.hostId === state.activeHostId);

export interface BookingSections {
  requests: Booking[];
  upcoming: Booking[];
  past: Booking[];
}

export const selectBookingSections = (state: HostAppState): BookingSections => {
  const bookings = selectBookings(state);
  return {
    requests: bookings.filter((booking) => booking.status === 'REQUESTED').sort(byDateAscending),
    upcoming: bookings.filter((booking) => booking.status === 'CONFIRMED').sort(byDateAscending),
    past: bookings.filter((booking) => booking.status !== 'REQUESTED' && booking.status !== 'CONFIRMED').sort(byDateDescending),
  };
};

export interface EarningsSummary {
  totalCents: number;
  pendingCents: number;
  paidOutCents: number;
}

export const selectEarnings = (state: HostAppState): EarningsSummary => {
  const payouts = selectPayouts(state);
  const pendingCents = sumCents(payouts.filter((payout) => payout.status === 'PENDING').map((payout) => payout.amountCents));
  const paidOutCents = sumCents(payouts.filter((payout) => payout.status === 'SENT').map((payout) => payout.amountCents));
  return { totalCents: pendingCents + paidOutCents, pendingCents, paidOutCents };
};

export interface OfferingPerformance {
  views: number;
  bookings: number;
  earnedCents: number;
}

/** Derived from the booking records so an offering and the earnings tab can never disagree. */
export const selectOfferingPerformance = (state: HostAppState, offering: Offering): OfferingPerformance => {
  const bookings = state.bookings.filter((booking) => booking.offeringId === offering.id);
  return {
    views: offering.views,
    bookings: bookings.filter((booking) => booking.status === 'CONFIRMED' || booking.status === 'COMPLETED').length,
    earnedCents: sumCents(bookings.filter((booking) => booking.status === 'COMPLETED').map((booking) => booking.hostReceivesCents)),
  };
};
