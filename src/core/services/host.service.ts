import { createHash } from 'node:crypto';
import { Host, OfferingCategory, Prisma, VerificationTier } from '@prisma/client';
import {
  API_ERROR_CODES,
  AVAILABILITY_ON_REQUEST,
  CENTS_PER_RAND,
  DEFAULT_OFFERING_CATEGORY,
  ENV_KEYS,
  HTTP_STATUS,
  OFFERING_CATEGORY_KEYWORDS,
  isAccountActive,
  isMockAuthEnabled,
  requireEnv,
} from '../constants';
import { HostIntakeDto, HostProfilePatchDto, OfferingDraftDto } from '@/shared/dto';
import { ApiError } from '../utils';
import { prisma } from './prisma.service';

const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');

const categoryFor = (label: string): OfferingCategory => {
  const trade = label.toLowerCase();
  const match = Object.entries(OFFERING_CATEGORY_KEYWORDS).find(([, keywords]) =>
    keywords.some((keyword) => trade.includes(keyword)),
  );

  return (match?.[0] as OfferingCategory) ?? DEFAULT_OFFERING_CATEGORY;
};

/** Derived, not random, so a retried submission updates the same rows instead of duplicating them. */
const offeringId = (hostId: string, title: string): string => sha256(`${hostId}:${title.toLowerCase()}`);

const toOfferingRow = (draft: OfferingDraftDto, host: Host): Prisma.OfferingCreateManyInput => ({
  id: offeringId(host.id, draft.title),
  hostId: host.id,
  category: categoryFor(draft.category),
  title: draft.title,
  description: draft.description,
  sourceLanguage: host.language,
  priceCents: Math.round((draft.rateAmount ?? 0) * CENTS_PER_RAND),
  inclusions: draft.tags,
  meetingPoint: host.serviceArea,
  town: host.serviceArea,
  region: host.serviceArea,
  availability: { ...AVAILABILITY_ON_REQUEST },
});

/**
 * Host carries no onboarding flag, so completion is derived from the two answers the
 * marketplace cannot work without. Both columns are required, so a host created at sign-up
 * holds empty strings until the onboarding path fills them, and a host the bot onboarded is
 * already complete on arrival.
 */
export const isHostOnboarded = ({ fullName, serviceArea }: Pick<Host, 'fullName' | 'serviceArea'>): boolean =>
  Boolean(fullName.trim() && serviceArea.trim());

export const findHostIdByPhone = (phone: string): Promise<{ id: string } | null> =>
  prisma.host.findUnique({ where: { phone }, select: { id: true } });

/**
 * The one answer to "may this host hold a session". A suspended, blocked or still-in-review host
 * reads exactly like a forged link or a deleted account — the caller is never told which.
 */
export const findActiveHostId = async (hostId: string): Promise<string | null> => {
  const host = await prisma.host.findUnique({ where: { id: hostId }, select: { id: true, status: true } });

  return host && isAccountActive(host.status) ? host.id : null;
};

export const upsertHostFromIntake = async ({ whatsappId, kyc, offerings }: HostIntakeDto): Promise<{ id: string }> => {
  const profile = {
    fullName: kyc.fullName,
    serviceArea: kyc.serviceArea,
    // Hashed with a server-side salt; the raw ID number is never persisted or logged.
    ...(kyc.idNumber && { idNumberHash: sha256(`${requireEnv(ENV_KEYS.idHashSalt)}:${kyc.idNumber}`) }),
    // A Meta media id until the document is pulled into the private bucket.
    ...(kyc.idDocumentMediaId && { idDocumentPath: kyc.idDocumentMediaId }),
  };

  const host = await prisma.host.upsert({
    where: { phone: whatsappId },
    create: { phone: whatsappId, ...profile },
    update: profile,
  });

  await prisma.offering.createMany({
    data: offerings.map((draft) => toOfferingRow(draft, host)),
    skipDuplicates: true,
  });

  return { id: host.id };
};

/**
 * Hackathon-only: while `ALLOW_MOCK_AUTH` is on, memoises `phone -> hostId` so the pitch demo's
 * repeated verify calls for the same phone skip the upsert round trip after the first. Caches
 * only `id` — the verify route never reads `tier`, so there is nothing here that can go stale
 * mid-demo. Process-local and lost on restart; capped so a long-running demo can't grow it
 * unbounded, evicting the oldest entry first. A host deleted from the DB while cached keeps
 * issuing sessions for its dead id until the process restarts — acceptable for the pitch.
 * Removal target: after judging, 2026-09-19 (see `isMockAuthEnabled`).
 */
const MOCK_HOST_ID_CACHE_LIMIT = 100;
const mockHostIdByPhone = new Map<string, string>();

/** Idempotent: a replayed OTP verify for the same phone must not create a second host. */
export const findOrCreateHostByPhone = async (phone: string): Promise<{ id: string }> => {
  if (isMockAuthEnabled()) {
    const cachedId = mockHostIdByPhone.get(phone);
    if (cachedId) return { id: cachedId };
  }

  const host = await prisma.host.upsert({
    where: { phone },
    create: { phone, fullName: '', serviceArea: '' },
    update: {},
    select: { id: true },
  });

  if (isMockAuthEnabled()) {
    if (mockHostIdByPhone.size >= MOCK_HOST_ID_CACHE_LIMIT) {
      const oldestPhone = mockHostIdByPhone.keys().next().value;
      if (oldestPhone) mockHostIdByPhone.delete(oldestPhone);
    }
    mockHostIdByPhone.set(phone, host.id);
  }

  return host;
};

const SAFE_HOST_SELECT = {
  id: true,
  phone: true,
  fullName: true,
  language: true,
  contactChannel: true,
  serviceArea: true,
  tier: true,
  payoutChannel: true,
  payoutPhone: true,
} as const;

/** Never selects idNumberHash or idDocumentPath — those never leave the server. */
export const updateHostProfile = (hostId: string, patch: HostProfilePatchDto) =>
  prisma.host.update({ where: { id: hostId }, data: patch, select: SAFE_HOST_SELECT });

/** Never selects idNumberHash or idDocumentPath — those never leave the server. */
export const findHostProfile = async (hostId: string) => {
  const host = await prisma.host.findUnique({ where: { id: hostId }, select: { ...SAFE_HOST_SELECT, story: true } });
  if (!host) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Host not found');
  return host;
};

/** Mock KYC (PRD Phase 2 wires a real provider). A COMMUNITY host is never downgraded by re-verifying. */
export const verifyHostIdentity = async (hostId: string): Promise<{ tier: VerificationTier }> => {
  const host = await prisma.host.findUnique({ where: { id: hostId }, select: { tier: true } });
  if (!host) throw new ApiError(API_ERROR_CODES.notFound, HTTP_STATUS.notFound, 'Host not found');
  if (host.tier === 'COMMUNITY') return host;

  return prisma.host.update({ where: { id: hostId }, data: { tier: 'IDENTITY' }, select: { tier: true } });
};
