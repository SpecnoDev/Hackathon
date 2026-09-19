import {
  BPS_DENOMINATOR,
  FREE_CANCELLATION_WINDOW_HOURS,
  LATE_CANCELLATION_REFUND_BPS,
  MS_PER_SECOND,
  MINUTES_PER_HOUR,
  SECONDS_PER_MINUTE,
  PLATFORM_FEE_BPS,
  TRAVELLER_SERVICE_FEE_BPS,
} from '@/core/constants';
import { DEFAULT_START_TIME } from '../constants';

const MS_PER_HOUR = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

export interface PriceBreakdown {
  subtotalCents: number;
  serviceFeeCents: number;
  totalCents: number;
  feeCents: number;
  hostReceivesCents: number;
}

/** The one place a booking total is computed, so every step of the flow and the stored booking always agree. Pure, so the browser can show it live. */
export const priceBooking = (
  offering: { priceCents: number; priceUnit: 'PER_PERSON' | 'PER_TRIP' },
  groupSize: number,
): PriceBreakdown => {
  const subtotalCents = offering.priceUnit === 'PER_PERSON' ? offering.priceCents * groupSize : offering.priceCents;
  const serviceFeeCents = Math.round((subtotalCents * TRAVELLER_SERVICE_FEE_BPS) / BPS_DENOMINATOR);
  const totalCents = subtotalCents + serviceFeeCents;
  const platformFeeCents = Math.round((subtotalCents * PLATFORM_FEE_BPS) / BPS_DENOMINATOR);

  return { subtotalCents, serviceFeeCents, totalCents, feeCents: platformFeeCents, hostReceivesCents: subtotalCents - platformFeeCents };
};

export type RefundKind = 'FULL' | 'PARTIAL' | 'NONE';

export interface Refund {
  kind: RefundKind;
  cents: number;
}

interface RefundableBooking {
  status: string;
  date: Date | string;
  startTime?: string | null;
  totalCents: number;
}

/** The booking starts at its stored day and start time; a time the host still has to confirm counts from the default. */
const startsAt = (booking: RefundableBooking): number => {
  const day = (typeof booking.date === 'string' ? booking.date : booking.date.toISOString()).slice(0, 10);
  return new Date(`${day}T${booking.startTime ?? DEFAULT_START_TIME}:00`).getTime();
};

/** A request the host hasn't answered was never charged, so there is nothing to refund and nothing lost. */
export const refundFor = (booking: RefundableBooking, now: Date): Refund => {
  if (booking.status === 'REQUESTED') return { kind: 'FULL', cents: 0 };

  const hoursLeft = (startsAt(booking) - now.getTime()) / MS_PER_HOUR;
  if (hoursLeft >= FREE_CANCELLATION_WINDOW_HOURS) return { kind: 'FULL', cents: booking.totalCents };
  if (hoursLeft > 0) return { kind: 'PARTIAL', cents: Math.round((booking.totalCents * LATE_CANCELLATION_REFUND_BPS) / BPS_DENOMINATOR) };
  return { kind: 'NONE', cents: 0 };
};
