import { BookingStatus, OfferingStatus, PayoutStatus, VerificationTier } from '@prisma/client';
import { prisma } from '@/core/services';

export interface AdminOverview {
  hostsByTier: Record<VerificationTier, number>;
  offeringsByStatus: Record<OfferingStatus, number>;
  bookingsByStatus: Record<BookingStatus, number>;
  paidOutCents: number;
}

/** groupBy omits empty buckets, so every enum value is filled in to keep the tiles stable. */
const countByValue = <T extends string>(
  rows: readonly Record<string, unknown>[],
  field: string,
  values: readonly T[],
): Record<T, number> =>
  Object.fromEntries(
    values.map((value) => [value, Number(rows.find((row) => row[field] === value)?._count ?? 0)]),
  ) as Record<T, number>;

export const loadAdminOverview = async (): Promise<AdminOverview> => {
  const [hosts, offerings, bookings, payouts] = await Promise.all([
    prisma.host.groupBy({ by: ['tier'], _count: true }),
    prisma.offering.groupBy({ by: ['status'], _count: true }),
    prisma.booking.groupBy({ by: ['status'], _count: true }),
    prisma.payout.aggregate({ _sum: { amountCents: true }, where: { status: PayoutStatus.SENT } }),
  ]);

  return {
    hostsByTier: countByValue(hosts, 'tier', Object.values(VerificationTier)),
    offeringsByStatus: countByValue(offerings, 'status', Object.values(OfferingStatus)),
    bookingsByStatus: countByValue(bookings, 'status', Object.values(BookingStatus)),
    paidOutCents: payouts._sum.amountCents ?? 0,
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
