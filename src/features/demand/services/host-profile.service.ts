import type { Language, VerificationTier } from '@prisma/client';
import { prisma } from '@/core/services';
import type { OfferingSummary } from '@/shared/dto';
import { OFFERING_SUMMARY_INCLUDE, toOfferingSummary } from './offering.service';

export interface HostProfile {
  id: string;
  firstName: string;
  town: string;
  tier: VerificationTier;
  portrait: string | null;
  story: string | null;
  /** ISO date the host registered. */
  memberSince: string;
  /** The host's own language plus every language a live listing of theirs is run in. */
  languages: Language[];
  offerings: OfferingSummary[];
}

/**
 * The person behind the listings, public fields only: never the phone, id hash, documents or payout details.
 * A host with no live listing is still findable by id, since a traveller may hold a link from a past booking.
 */
export const getHostProfile = async (hostId: string): Promise<HostProfile | null> => {
  const host = await prisma.host.findUnique({
    where: { id: hostId },
    select: {
      id: true,
      fullName: true,
      serviceArea: true,
      tier: true,
      photoUrl: true,
      story: true,
      language: true,
      createdAt: true,
      offerings: { where: { status: 'LIVE' }, include: OFFERING_SUMMARY_INCLUDE, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!host) return null;

  return {
    id: host.id,
    firstName: host.fullName.split(' ')[0],
    town: host.serviceArea,
    tier: host.tier,
    portrait: host.photoUrl,
    story: host.story,
    memberSince: host.createdAt.toISOString(),
    languages: [...new Set([host.language, ...host.offerings.flatMap((offering) => offering.languages)])],
    offerings: host.offerings.map(toOfferingSummary),
  };
};
