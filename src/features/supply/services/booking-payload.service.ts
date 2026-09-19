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
 * The server has no traveller phone number or decline-reason column yet, and no group-payment
 * ledger — a single `paymentRef` stands in for "the group has paid", so a booking with one is
 * treated as paid in full and one without as nothing paid yet. `travellerPhone` and
 * `responseReason` come from the matching local row when there is one (there never will be for a
 * real synced booking; only a locally seeded/demo booking can supply them).
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
  groupPayment: { paid: row.paymentRef ? row.groupSize : 0, of: row.groupSize },
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
