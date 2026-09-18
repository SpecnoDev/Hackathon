import { BPS_DENOMINATOR, FREE_CANCELLATION_WINDOW_HOURS, LATE_CANCELLATION_REFUND_BPS, TRAVELLER_SERVICE_FEE_BPS } from '@/core/constants';
import { MS_PER_HOUR } from '../../constants';
import type { Listing, RefundKind, Trip } from '../../interfaces';

export interface PriceBreakdown {
  subtotalCents: number;
  serviceFeeCents: number;
  totalCents: number;
}

/** The PRD asks for a clear total with fees before payment. Every amount shown in the booking flow comes from here. */
export const priceBooking = (listing: Pick<Listing, 'priceCents' | 'priceUnit'>, guests: number): PriceBreakdown => {
  const subtotalCents = listing.priceUnit === 'PER_PERSON' ? listing.priceCents * guests : listing.priceCents;
  const serviceFeeCents = Math.round((subtotalCents * TRAVELLER_SERVICE_FEE_BPS) / BPS_DENOMINATOR);
  return { subtotalCents, serviceFeeCents, totalCents: subtotalCents + serviceFeeCents };
};

const DEFAULT_START = '09:00';
const startsAt = (trip: Pick<Trip, 'date' | 'time'>): number => new Date(`${trip.date}T${trip.time ?? DEFAULT_START}:00`).getTime();

export interface Refund {
  kind: RefundKind;
  cents: number;
}

/** A request the host has not answered was never charged, so there is nothing to refund and nothing lost. */
export const refundFor = (trip: Trip, now: Date): Refund => {
  if (trip.status === 'REQUESTED') return { kind: 'FULL', cents: 0 };
  const hoursLeft = (startsAt(trip) - now.getTime()) / MS_PER_HOUR;
  if (hoursLeft >= FREE_CANCELLATION_WINDOW_HOURS) return { kind: 'FULL', cents: trip.totalCents };
  if (hoursLeft > 0) return { kind: 'PARTIAL', cents: Math.round((trip.totalCents * LATE_CANCELLATION_REFUND_BPS) / BPS_DENOMINATOR) };
  return { kind: 'NONE', cents: 0 };
};

export const isUpcoming = (trip: Trip, now: Date): boolean => (trip.status === 'CONFIRMED' || trip.status === 'REQUESTED') && startsAt(trip) >= now.getTime();
