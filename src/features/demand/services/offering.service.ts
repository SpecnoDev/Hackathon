import { prisma } from '@/core/services';
import type { OfferingListQuery, OfferingSummary } from '@/shared/dto';

export const listLiveRegions = async (): Promise<string[]> => {
  const rows = await prisma.offering.findMany({
    where: { status: 'LIVE' },
    select: { region: true },
    distinct: ['region'],
    orderBy: { region: 'asc' },
  });
  return rows.map((row) => row.region);
};

export const listLiveOfferings = async (query: OfferingListQuery): Promise<OfferingSummary[]> => {
  const offerings = await prisma.offering.findMany({
    where: {
      status: 'LIVE',
      region: query.region,
      category: query.category,
      title: query.q ? { contains: query.q, mode: 'insensitive' } : undefined,
      OR: query.groupSize
        ? [{ groupMax: null }, { groupMax: { gte: query.groupSize } }]
        : undefined,
    },
    include: { host: { select: { fullName: true, tier: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return offerings.map((offering) => ({
    id: offering.id,
    title: offering.title,
    category: offering.category,
    town: offering.town,
    region: offering.region,
    priceCents: offering.priceCents,
    durationMin: offering.durationMin,
    photos: offering.photos,
    avgRating: offering.avgRating,
    reviewCount: offering.reviewCount,
    vouchCount: offering.vouchCount,
    sustainabilityTag: offering.sustainabilityTag,
    hostTier: offering.host.tier,
    hostFirstName: offering.host.fullName.split(' ')[0],
  }));
};
