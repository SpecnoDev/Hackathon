import type { Listing, Plan, TravellerAppState, Trip } from '../../interfaces';
import { isUpcoming } from './booking-pricing.service';
import { findListing } from './catalogue.service';

export interface TripWithListing {
  trip: Trip;
  listing: Listing;
}

const withListing = (trip: Trip): TripWithListing[] => {
  const listing = findListing(trip.listingId);
  return listing ? [{ trip, listing }] : [];
};

const byDate = (a: TripWithListing, b: TripWithListing): number => `${a.trip.date}${a.trip.time ?? ''}`.localeCompare(`${b.trip.date}${b.trip.time ?? ''}`);

export const selectTrip = (state: TravellerAppState, tripId: string): TripWithListing | undefined => {
  const trip = state.trips.find((item) => item.id === tripId);
  return trip ? withListing(trip)[0] : undefined;
};

/** Upcoming soonest first; everything else newest first. A cancelled trip is past, whatever its date. */
export const selectTripSections = (state: TravellerAppState, now: Date): { upcoming: TripWithListing[]; past: TripWithListing[] } => {
  const all = state.trips.flatMap(withListing);
  return {
    upcoming: all.filter(({ trip }) => isUpcoming(trip, now)).sort(byDate),
    past: all.filter(({ trip }) => !isUpcoming(trip, now)).sort((a, b) => byDate(b, a)),
  };
};

export const selectSavedListings = (state: TravellerAppState): Listing[] => state.savedIds.flatMap((id) => findListing(id) ?? []);

export const selectIsSaved = (state: TravellerAppState, listingId: string): boolean => state.savedIds.includes(listingId);

export const selectPlan = (state: TravellerAppState, planId: string): Plan | undefined => state.plans.find((plan) => plan.id === planId);

/** The trip, if any, that already covers this stop of a plan: booked from the plan, or booked separately for the same listing. */
export const selectTripForListing = (state: TravellerAppState, listingId: string): Trip | undefined =>
  state.trips.find((trip) => trip.listingId === listingId && (trip.status === 'CONFIRMED' || trip.status === 'REQUESTED'));
