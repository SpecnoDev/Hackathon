'use client';

import { useEffect } from 'react';
import { useTravellerApp, useTravellerReady } from './use-traveller-app.hook';
import type { BookingDraft, Listing, TravellerAppState } from '../interfaces';
import { findListing, isBookableDay, openTimes, travellerAppStore } from '../services/client';

/** A draft whose day and start time are chosen and can still be booked. */
export type ScheduledDraft = BookingDraft & { date: string; time: string | null };

interface BookingDraftView {
  listing?: Listing;
  /** Missing for one render after the saved state loads, until the draft for this listing exists. */
  draft?: BookingDraft;
  /** The same draft, once there is nothing left to choose on the date step. */
  scheduled?: ScheduledDraft;
}

const selectBooking = (state: TravellerAppState): BookingDraft | undefined => state.booking;

const isScheduled = (listing: Listing, draft: BookingDraft, now: Date): draft is ScheduledDraft => {
  const { weekdays, times } = listing.availability;
  if (!draft.date || !isBookableDay(weekdays, draft.date, now)) return false;
  return times.length === 0 ? draft.time === null : draft.time != null && openTimes(times, draft.date, now).includes(draft.time);
};

/** What the four booking steps share: the listing, and the draft that belongs to it. */
export const useBookingDraft = (listingId: string): BookingDraftView => {
  const ready = useTravellerReady();
  const booking = useTravellerApp(selectBooking);

  // Waits for the saved state: a draft started before it loads is thrown away when the load replaces the store.
  useEffect(() => {
    if (ready) travellerAppStore.startBooking(listingId);
  }, [ready, listingId]);

  const listing = findListing(listingId);
  const draft = booking?.listingId === listingId ? booking : undefined;
  return { listing, draft, scheduled: listing && draft && isScheduled(listing, draft, new Date()) ? draft : undefined };
};
