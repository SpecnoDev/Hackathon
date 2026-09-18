import { OfferingStatus } from '@prisma/client';
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

export const findLiveOffering = (id: string) =>
  prisma.offering.findFirst({
    where: { id, status: OfferingStatus.LIVE },
    include: { host: hostSummary },
  });
