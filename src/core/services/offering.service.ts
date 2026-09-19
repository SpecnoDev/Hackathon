import { OfferingCategory, OfferingStatus, Prisma, VerificationTier } from '@prisma/client';
import { ACTIVE_ACCOUNT_STATUS, API_ERROR_CODES, HTTP_STATUS, OFFERING_LIST_DEFAULT_TAKE } from '@/core/constants';
import { ApiError } from '@/core/utils';
import { OfferingFieldsPatchDto, OfferingQueryDto, OfferingWriteDto } from '@/shared/dto';
import { prisma } from './prisma.service';

const hostSummary = { select: { id: true, fullName: true, photoUrl: true, tier: true } };

/**
 * What the public may see, declared once so every caller inherits it instead of remembering it.
 * Suspending a host already pauses their live rows; this second condition is what makes the
 * status itself binding, so a row that reaches LIVE by any other path still stays off the market.
 */
export const PUBLIC_OFFERING_WHERE = {
  status: OfferingStatus.LIVE,
  host: { status: ACTIVE_ACCOUNT_STATUS },
} as const;

export const listLiveOfferings = ({ region, category, q, take }: OfferingQueryDto) =>
  prisma.offering.findMany({
    where: {
      ...PUBLIC_OFFERING_WHERE,
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
    orderBy: { updatedAt: 'desc' },
    take: OFFERING_LIST_DEFAULT_TAKE,
  });

export const findLiveOffering = (id: string) =>
  prisma.offering.findFirst({
    where: { id, ...PUBLIC_OFFERING_WHERE },
    include: { host: hostSummary },
  });

const toJsonInput = (value: Record<string, unknown>): Prisma.InputJsonValue => value as Prisma.InputJsonValue;

/** PRD: Tier 0 drafts but cannot go live; transport needs its credential at Tier 2 before going live. */
export const goLiveStatus = (tier: VerificationTier, category: OfferingCategory): OfferingStatus => {
  if (tier === 'REGISTERED') return 'DRAFT';
  if (category === 'TRANSPORT' && tier !== 'COMMUNITY') return 'IN_REVIEW';
  return 'LIVE';
};

/**
 * Upsert by the client-supplied id. A replay from the same host re-applies `goLiveStatus`,
 * since the host's tier may have changed since the last attempt (e.g. after KYC).
 */
export const createHostOffering = async (
  hostId: string,
  input: OfferingWriteDto,
): Promise<{ id: string; status: OfferingStatus }> => {
  const { id, availability, ...fields } = input;

  const [host, existing] = await Promise.all([
    prisma.host.findUnique({ where: { id: hostId }, select: { tier: true } }),
    prisma.offering.findUnique({ where: { id }, select: { hostId: true } }),
  ]);
  if (!host) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Host not found');
  if (existing && existing.hostId !== hostId) {
    throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Offering not found');
  }

  const data = {
    ...fields,
    availability: toJsonInput(availability),
    hostId,
    status: goLiveStatus(host.tier, input.category),
  };

  return prisma.offering.upsert({
    where: { id },
    create: { id, ...data },
    update: data,
    select: { id: true, status: true },
  });
};

/** A category change on a row already visible to travellers must re-clear the transport gate. */
const REVIEW_GATED_STATUSES: readonly OfferingStatus[] = ['LIVE', 'IN_REVIEW'];

/** Scoped by hostId on every query — a mismatch reads as NOT_FOUND, never revealing another host's row. */
export const updateHostOfferingFields = async (
  hostId: string,
  offeringId: string,
  patch: OfferingFieldsPatchDto,
): Promise<{ id: string; status: OfferingStatus }> => {
  const existing = await prisma.offering.findFirst({ where: { id: offeringId, hostId }, select: { status: true } });
  if (!existing) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Offering not found');

  const { availability, ...fields } = patch;

  // A category patch can move a live/in-review offering between tiers' gates; a paused, draft
  // or rejected row is untouched until the host explicitly resubmits it.
  let statusPatch: { status: OfferingStatus } | undefined;
  if (patch.category && REVIEW_GATED_STATUSES.includes(existing.status)) {
    const host = await prisma.host.findUnique({ where: { id: hostId }, select: { tier: true } });
    if (!host) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Host not found');
    statusPatch = { status: goLiveStatus(host.tier, patch.category) };
  }

  return prisma.offering.update({
    where: { id: offeringId },
    data: { ...fields, ...(availability && { availability: toJsonInput(availability) }), ...statusPatch },
    select: { id: true, status: true },
  });
};

/** A pause is unconditional; a LIVE request re-runs `goLiveStatus` against the host's current tier, never the client's say-so. */
export const setHostOfferingStatus = async (
  hostId: string,
  offeringId: string,
  status: 'PAUSED' | 'LIVE',
): Promise<{ id: string; status: OfferingStatus }> => {
  const offering = await prisma.offering.findFirst({ where: { id: offeringId, hostId }, select: { category: true } });
  if (!offering) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Offering not found');

  if (status === 'PAUSED') {
    return prisma.offering.update({
      where: { id: offeringId },
      data: { status: 'PAUSED' },
      select: { id: true, status: true },
    });
  }

  const host = await prisma.host.findUnique({ where: { id: hostId }, select: { tier: true } });
  if (!host) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Host not found');

  return prisma.offering.update({
    where: { id: offeringId },
    data: { status: goLiveStatus(host.tier, offering.category) },
    select: { id: true, status: true },
  });
};

export const deleteHostOffering = async (hostId: string, offeringId: string): Promise<{ id: string }> => {
  const { count } = await prisma.offering.deleteMany({ where: { id: offeringId, hostId } });
  if (count === 0) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Offering not found');

  return { id: offeringId };
};
