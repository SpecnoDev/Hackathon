import { createHash } from 'node:crypto';
import { Host, OfferingCategory, Prisma } from '@prisma/client';
import {
  AVAILABILITY_ON_REQUEST,
  CENTS_PER_RAND,
  DEFAULT_OFFERING_CATEGORY,
  ENV_KEYS,
  OFFERING_CATEGORY_KEYWORDS,
  requireEnv,
} from '../constants';
import { HostIntakeDto, OfferingDraftDto } from '@/shared/dto';
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
