import { PAYOUT_LIST_DEFAULT_TAKE } from '@/core/constants';
import { prisma } from './prisma.service';

const HOST_PAYOUT_SELECT = {
  id: true,
  bookingId: true,
  amountCents: true,
  channel: true,
  destination: true,
  status: true,
  sentAt: true,
} as const;

/**
 * Scoped by the host id a guard returned. Bounded. Payout carries no createdAt of its own, so
 * "newest first" sorts by the booking it settles — the only timestamp with real ordering intent.
 */
export const listHostPayouts = (hostId: string) =>
  prisma.payout.findMany({
    where: { hostId },
    orderBy: { booking: { createdAt: 'desc' } },
    take: PAYOUT_LIST_DEFAULT_TAKE,
    select: HOST_PAYOUT_SELECT,
  });
