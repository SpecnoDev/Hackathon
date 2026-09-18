import { OfferingStatus } from '@prisma/client';
import { OFFERING_LIST_DEFAULT_TAKE } from '@/core/constants';
import { OfferingQueryDto } from '@/shared/dto';
import { prisma } from './prisma.service';

const hostSummary = { select: { id: true, fullName: true, photoUrl: true, tier: true } };

export const listLiveOfferings = ({ region, category, q, take }: OfferingQueryDto) =>
  prisma.offering.findMany({
    where: {
      status: OfferingStatus.LIVE,
      ...(region && { region: { equals: region, mode: 'insensitive' as const } }),
      ...(category && { category }),
      ...(q && {
        OR: [
          { title: { contains: q, mode: 'insensitive' as const } },
          { description: { contains: q, mode: 'insensitive' as const } },
        ],
      }),
    },
    include: { host: hostSummary },
    orderBy: { createdAt: 'desc' },
    take,
  });

/** Every status, so a host sees their drafts. Scope by the id a guard returned, never by the body. */
export const listHostOfferings = (hostId: string) =>
  prisma.offering.findMany({
    where: { hostId },
    select: { id: true, title: true, status: true, priceCents: true },
    orderBy: { updatedAt: 'desc' },
    take: OFFERING_LIST_DEFAULT_TAKE,
  });

export const findLiveOffering = (id: string) =>
  prisma.offering.findFirst({
    where: { id, status: OfferingStatus.LIVE },
    include: { host: hostSummary },
  });
