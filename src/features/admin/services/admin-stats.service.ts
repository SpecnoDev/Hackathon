import { AccountStatus, BookingStatus, OfferingStatus, PayoutStatus, VerificationTier } from '@prisma/client';
import { prisma } from '@/core/services';

export interface PayoutTotals {
  count: number;
  cents: number;
}

export interface AdminOverview {
  hostsByStatus: Record<AccountStatus, number>;
  travellersByStatus: Record<AccountStatus, number>;
  hostsByTier: Record<VerificationTier, number>;
  offeringsByStatus: Record<OfferingStatus, number>;
  offeringsAwaitingReview: number;
  bookingsByStatus: Record<BookingStatus, number>;
  bookingsInFlight: number;
  payoutsByStatus: Record<PayoutStatus, PayoutTotals>;
  paidOutCents: number;
}

/** Neither side is done: the traveller is still owed the experience, the host still owed the money. */
const IN_FLIGHT_BOOKING_STATUSES: readonly BookingStatus[] = [BookingStatus.REQUESTED, BookingStatus.CONFIRMED];

/** groupBy omits empty buckets, so every enum value is filled in to keep the tiles stable. */
const countByValue = <T extends string>(
  rows: readonly Record<string, unknown>[],
  field: string,
  values: readonly T[],
): Record<T, number> =>
  Object.fromEntries(
    values.map((value) => [value, Number(rows.find((row) => row[field] === value)?._count ?? 0)]),
  ) as Record<T, number>;

const sumOf = (counts: Record<string, number>, keys: readonly string[]): number =>
  keys.reduce((total, key) => total + counts[key], 0);

export const loadAdminOverview = async (): Promise<AdminOverview> => {
  const [hostStatuses, travellerStatuses, tiers, offerings, bookings, payouts] = await Promise.all([
    prisma.host.groupBy({ by: ['status'], _count: true }),
    prisma.traveller.groupBy({ by: ['status'], _count: true }),
    prisma.host.groupBy({ by: ['tier'], _count: true }),
    prisma.offering.groupBy({ by: ['status'], _count: true }),
    prisma.booking.groupBy({ by: ['status'], _count: true }),
    prisma.payout.groupBy({ by: ['status'], _count: true, _sum: { amountCents: true } }),
  ]);

  const offeringsByStatus = countByValue(offerings, 'status', Object.values(OfferingStatus));
  const bookingsByStatus = countByValue(bookings, 'status', Object.values(BookingStatus));
  const payoutsByStatus = Object.fromEntries(
    Object.values(PayoutStatus).map((status) => {
      const row = payouts.find((payout) => payout.status === status);

      return [status, { count: Number(row?._count ?? 0), cents: row?._sum.amountCents ?? 0 }];
    }),
  ) as Record<PayoutStatus, PayoutTotals>;

  return {
    hostsByStatus: countByValue(hostStatuses, 'status', Object.values(AccountStatus)),
    travellersByStatus: countByValue(travellerStatuses, 'status', Object.values(AccountStatus)),
    hostsByTier: countByValue(tiers, 'tier', Object.values(VerificationTier)),
    offeringsByStatus,
    offeringsAwaitingReview: offeringsByStatus[OfferingStatus.IN_REVIEW],
    bookingsByStatus,
    bookingsInFlight: sumOf(bookingsByStatus, IN_FLIGHT_BOOKING_STATUSES),
    payoutsByStatus,
    paidOutCents: payoutsByStatus[PayoutStatus.SENT].cents,
  };
};

export const listHostsForAdmin = () =>
  prisma.host.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      phone: true,
      serviceArea: true,
      tier: true,
      _count: { select: { offerings: true } },
    },
  });

export const listOfferingsForAdmin = () =>
  prisma.offering.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      category: true,
      priceCents: true,
      town: true,
      host: { select: { fullName: true } },
    },
  });
