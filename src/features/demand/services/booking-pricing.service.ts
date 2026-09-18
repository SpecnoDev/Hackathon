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

const MS_PER_HOUR = MS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;

export interface PriceBreakdown {
  totalCents: number;
  feeCents: number;
  hostReceivesCents: number;
}

/** The one place a booking total is computed, so the pre-checkout preview and the stored booking always agree. */
export const priceBooking = (
  offering: { priceCents: number; priceUnit: 'PER_PERSON' | 'PER_TRIP' },
  groupSize: number,
): PriceBreakdown => {
  const subtotalCents = offering.priceUnit === 'PER_PERSON' ? offering.priceCents * groupSize : offering.priceCents;
  const serviceFeeCents = Math.round((subtotalCents * TRAVELLER_SERVICE_FEE_BPS) / BPS_DENOMINATOR);
  const totalCents = subtotalCents + serviceFeeCents;
  const platformFeeCents = Math.round((subtotalCents * PLATFORM_FEE_BPS) / BPS_DENOMINATOR);

  return { totalCents, feeCents: platformFeeCents, hostReceivesCents: subtotalCents - platformFeeCents };
};

export type RefundKind = 'FULL' | 'PARTIAL' | 'NONE';

export interface Refund {
  kind: RefundKind;
  cents: number;
}

/** A request the host hasn't answered was never charged, so there is nothing to refund and nothing lost. */
export const refundFor = (
  booking: { status: string; date: Date | string; totalCents: number },
  now: Date,
): Refund => {
  const bookingDate = typeof booking.date === 'string' ? new Date(booking.date) : booking.date;
  return refundForDate({ ...booking, date: bookingDate }, now);
};

const refundForDate = (booking: { status: string; date: Date; totalCents: number }, now: Date): Refund => {
  if (booking.status === 'REQUESTED') return { kind: 'FULL', cents: 0 };

  const hoursLeft = (booking.date.getTime() - now.getTime()) / MS_PER_HOUR;
  if (hoursLeft >= FREE_CANCELLATION_WINDOW_HOURS) return { kind: 'FULL', cents: booking.totalCents };
  if (hoursLeft > 0) {
    return { kind: 'PARTIAL', cents: Math.round((booking.totalCents * LATE_CANCELLATION_REFUND_BPS) / BPS_DENOMINATOR) };
  }
  return { kind: 'NONE', cents: 0 };
};
