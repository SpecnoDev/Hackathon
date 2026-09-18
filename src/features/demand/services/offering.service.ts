import type { Prisma } from '@prisma/client';
import { OFFERING_LIST_DEFAULT_TAKE } from '@/core/constants';
import { prisma } from '@/core/services';
import type { OfferingListQuery, OfferingSort, OfferingSummary } from '@/shared/dto';

const VERIFIED_TIERS = ['IDENTITY', 'COMMUNITY'] as const;

/** "Recommended" puts rated listings first; the rest fall back to newest, so a new host is never buried under nothing. */
const ORDER_BY: Record<OfferingSort, Prisma.OfferingOrderByWithRelationInput[]> = {
  recommended: [{ avgRating: { sort: 'desc', nulls: 'last' } }, { reviewCount: 'desc' }, { createdAt: 'desc' }],
  top_rated: [{ avgRating: { sort: 'desc', nulls: 'last' } }, { reviewCount: 'desc' }],
  newest: [{ createdAt: 'desc' }],
  price_asc: [{ priceCents: 'asc' }],
  price_desc: [{ priceCents: 'desc' }],
};

export interface RegionWithSample {
  region: string;
  samplePhoto: string | null;
  /** Distinct hosts with something live there — the tile says "4 hosts", so it counts people, not listings. */
  count: number;
}

/**
 * No `Place` model in the schema — a "place" is a live region, grouped at query time from real offerings.
 * The sample photo is just the first live offering's own first photo for that region, not curated art.
 */
export const listRegionsWithSample = async (): Promise<RegionWithSample[]> => {
  const offerings = await prisma.offering.findMany({
    where: { status: 'LIVE' },
    select: { region: true, hostId: true, photos: true },
    orderBy: { createdAt: 'desc' },
  });

  const byRegion = new Map<string, RegionWithSample & { hostIds: Set<string> }>();
  for (const offering of offerings) {
    const existing = byRegion.get(offering.region) ?? { region: offering.region, samplePhoto: null, count: 0, hostIds: new Set<string>() };
    existing.hostIds.add(offering.hostId);
    existing.count = existing.hostIds.size;
    existing.samplePhoto ??= offering.photos[0] ?? null;
    byRegion.set(offering.region, existing);
  }

  return [...byRegion.values()]
    .map(({ hostIds: _hostIds, ...region }) => region)
    .sort((a, b) => a.region.localeCompare(b.region));
};

const textMatch = (q: string): Prisma.StringFilter => ({ contains: q, mode: 'insensitive' });

export const OFFERING_SUMMARY_INCLUDE = { host: { select: { fullName: true, tier: true } } } satisfies Prisma.OfferingInclude;

type OfferingWithHost = Prisma.OfferingGetPayload<{ include: typeof OFFERING_SUMMARY_INCLUDE }>;

/** The one mapping from a row to the card shape, so every list of offerings reads the same. */
export const toOfferingSummary = (offering: OfferingWithHost): OfferingSummary => ({
  id: offering.id,
  title: offering.title,
  category: offering.category,
  town: offering.town,
  region: offering.region,
  priceCents: offering.priceCents,
  priceUnit: offering.priceUnit,
  bookingMode: offering.bookingMode,
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
});

export const listLiveOfferings = async (query: OfferingListQuery): Promise<OfferingSummary[]> => {
  const sort = query.sort ?? 'recommended';
  const offerings = await prisma.offering.findMany({
    where: {
      status: 'LIVE',
      region: query.region,
      category: query.category,
      id: query.ids ? { in: query.ids.split(',') } : undefined,
      priceCents: query.maxPriceCents ? { lte: query.maxPriceCents } : undefined,
      durationMin: query.maxDurationMin ? { lte: query.maxDurationMin } : undefined,
      languages: query.lang ? { has: query.lang } : undefined,
      reviewCount: sort === 'top_rated' ? { gt: 0 } : undefined,
      host: query.verifiedOnly ? { tier: { in: [...VERIFIED_TIERS] } } : undefined,
      AND: [
        query.q ? { OR: [{ title: textMatch(query.q) }, { description: textMatch(query.q) }, { town: textMatch(query.q) }, { region: textMatch(query.q) }] } : {},
        query.groupSize ? { OR: [{ groupMax: null }, { groupMax: { gte: query.groupSize } }] } : {},
      ],
    },
    include: OFFERING_SUMMARY_INCLUDE,
    orderBy: ORDER_BY[sort],
    take: query.take ?? OFFERING_LIST_DEFAULT_TAKE,
  });

  return offerings.map(toOfferingSummary);
};

export interface PlaceHost {
  id: string;
  firstName: string;
  town: string;
  tier: OfferingSummary['hostTier'];
  portrait: string | null;
}

/** The people behind a place: every host with something live there. */
export const listPlaceHosts = async (region: string): Promise<PlaceHost[]> => {
  const hosts = await prisma.host.findMany({
    where: { offerings: { some: { status: 'LIVE', region } } },
    select: { id: true, fullName: true, serviceArea: true, tier: true, photoUrl: true },
    orderBy: { fullName: 'asc' },
  });

  return hosts.map((host) => ({
    id: host.id,
    firstName: host.fullName.split(' ')[0],
    town: host.serviceArea,
    tier: host.tier,
    portrait: host.photoUrl,
  }));
};
