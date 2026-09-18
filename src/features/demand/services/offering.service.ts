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

export interface RegionWithSample {
  region: string;
  samplePhoto: string | null;
  count: number;
}

/**
 * No `Place` model in the schema — a "place" is a live region, grouped at query time from real offerings.
 * The sample photo is just the first live offering's own first photo for that region, not curated art.
 */
export const listRegionsWithSample = async (): Promise<RegionWithSample[]> => {
  const offerings = await prisma.offering.findMany({
    where: { status: 'LIVE' },
    select: { region: true, photos: true },
    orderBy: { createdAt: 'desc' },
  });

  const byRegion = new Map<string, RegionWithSample>();
  for (const offering of offerings) {
    const existing = byRegion.get(offering.region);
    if (existing) {
      existing.count += 1;
      existing.samplePhoto ??= offering.photos[0] ?? null;
    } else {
      byRegion.set(offering.region, { region: offering.region, samplePhoto: offering.photos[0] ?? null, count: 1 });
    }
  }

  return [...byRegion.values()].sort((a, b) => a.region.localeCompare(b.region));
};

export const listLiveOfferings = async (query: OfferingListQuery): Promise<OfferingSummary[]> => {
  const offerings = await prisma.offering.findMany({
    where: {
      status: 'LIVE',
      region: query.region,
      category: query.category,
      title: query.q ? { contains: query.q, mode: 'insensitive' } : undefined,
      id: query.ids ? { in: query.ids.split(',') } : undefined,
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
    priceUnit: offering.priceUnit,
    durationMin: offering.durationMin,
    groupMin: offering.groupMin,
    groupMax: offering.groupMax,
    inclusions: offering.inclusions,
    photos: offering.photos,
    avgRating: offering.avgRating,
    reviewCount: offering.reviewCount,
    vouchCount: offering.vouchCount,
    sustainabilityTag: offering.sustainabilityTag,
    hostTier: offering.host.tier,
    hostFirstName: offering.host.fullName.split(' ')[0],
  }));
};
