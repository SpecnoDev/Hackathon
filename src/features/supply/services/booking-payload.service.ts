import type { Booking, BookingStatus, Payout, PayoutChannel, PayoutStatus } from '../interfaces';

/** GET /hosts/me/bookings' shape (see core/services/booking.service.ts): newest first, max 50. */
export interface HostBookingRow {
  id: string;
  offeringId: string;
  status: BookingStatus;
  date: string;
  groupSize: number;
  totalCents: number;
  feeCents: number;
  hostReceivesCents: number;
  paymentRef: string | null;
  respondBy: string;
  createdAt: string;
  offeringTitle: string;
  travellerName: string;
}

/**
 * The server has no group-payment ledger yet. A CONFIRMED or COMPLETED booking is settled, so it
 * is always paid in full; a DECLINED or CANCELLED one never collects payment. Only a still-pending
 * REQUESTED booking falls back to `paymentRef` as a stand-in for "the group has paid".
 */
const groupPaymentFor = (row: HostBookingRow): Booking['groupPayment'] => {
  if (row.status === 'CONFIRMED' || row.status === 'COMPLETED') return { paid: row.groupSize, of: row.groupSize };
  if (row.status === 'DECLINED' || row.status === 'CANCELLED') return { paid: 0, of: row.groupSize };
  return { paid: row.paymentRef ? row.groupSize : 0, of: row.groupSize };
};

/**
 * `travellerPhone` and `responseReason` come from the matching local row when there is one (there
 * never will be for a real synced booking; only a locally seeded/demo booking can supply them).
 */
export const fromBookingRow = (row: HostBookingRow, hostId: string, local?: Booking): Booking => ({
  id: row.id,
  offeringId: row.offeringId,
  hostId,
  travellerName: row.travellerName,
  travellerPhone: local?.travellerPhone,
  status: row.status,
  date: row.date,
  groupSize: row.groupSize,
  totalCents: row.totalCents,
  feeCents: row.feeCents,
  hostReceivesCents: row.hostReceivesCents,
  respondBy: row.respondBy,
  groupPayment: groupPaymentFor(row),
  responseReason: local?.responseReason,
  pendingSync: false,
  createdAt: row.createdAt,
});

/** GET /hosts/me/payouts' shape (see core/services/payout.service.ts). `destination` is already masked server-side. */
export interface HostPayoutRow {
  id: string;
  bookingId: string;
  amountCents: number;
  channel: PayoutChannel;
  destination: string;
  status: PayoutStatus;
  sentAt: string | null;
}

/** No ETA column on the server yet, so `expectedBy` is left unset — PayoutPage and BookingCompletedPage fall back to an ETA-less copy when it's missing. */
export const fromPayoutRow = (row: HostPayoutRow, hostId: string): Payout => ({
  id: row.id,
  bookingId: row.bookingId,
  hostId,
  amountCents: row.amountCents,
  channel: row.channel,
  destination: row.destination,
  status: row.status,
  sentAt: row.sentAt ?? undefined,
});
