import { z } from 'zod';
import type { OfferingCategory } from '@prisma/client';
import { OFFERING_ID_MAX_LENGTH, OFFERING_LIST_DEFAULT_TAKE, OFFERING_LIST_MAX_TAKE } from '@/core/constants';

export const OFFERING_CATEGORIES = [
  'TOUR',
  'FOOD',
  'GUIDE',
  'TRANSPORT',
  'ACCOMMODATION',
  'CONCIERGE',
  'SECURITY',
] as const;

/**
 * The database owns this list. Prisma generates `OfferingCategory` from schema.prisma, and the
 * assertion below fails the build if the two ever disagree in either direction, so adding a
 * category to the schema without adding it here cannot compile. The literals are restated rather
 * than derived because this file is pulled into client forms, where the Prisma runtime cannot go;
 * `import type` is erased, so nothing ships to the browser.
 *
 * A category added straight to the database without a schema change is a different failure and is
 * caught by `npm run db:check`, not by the compiler.
 */
type Exhaustive<Listed extends OfferingCategory> = [OfferingCategory] extends [Listed]
  ? true
  : ['missing from OFFERING_CATEGORIES:', Exclude<OfferingCategory, Listed>];

export const OFFERING_CATEGORIES_MATCH_SCHEMA: Exhaustive<(typeof OFFERING_CATEGORIES)[number]> = true;

export const PRICE_UNITS = ['PER_PERSON', 'PER_TRIP'] as const;

export const SUSTAINABILITY_TAGS = ['LOW_IMPACT_TRAVEL', 'SUPPORTS_LOCAL_LIVELIHOODS'] as const;

/** Mirrors the Prisma `Language` enum without importing the client — this file may be pulled into a client form. */
export const LANGUAGE_CODES = ['EN', 'AF', 'XH', 'ZU'] as const;

/** What the bot's extraction produces: a trade in its own words, and a rate only when one was stated. */
export const offeringDraftSchema = z.object({
  title: z.string().trim().min(1),
  category: z.string().trim().min(1),
  description: z.string().trim().min(1),
  rateAmount: z.number().nonnegative().nullable(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export const offeringQuerySchema = z.object({
  region: z.string().trim().min(1).optional(),
  category: z.enum(OFFERING_CATEGORIES).optional(),
  q: z.string().trim().min(1).optional(),
  take: z.coerce.number().int().positive().max(OFFERING_LIST_MAX_TAKE).default(OFFERING_LIST_DEFAULT_TAKE),
});

export type OfferingDraftDto = z.infer<typeof offeringDraftSchema>;
export type OfferingQueryDto = z.infer<typeof offeringQuerySchema>;

export const offeringListQuerySchema = z.object({
  region: z.string().trim().min(1).optional(),
  category: z.enum(OFFERING_CATEGORIES).optional(),
  q: z.string().trim().min(1).optional(),
  lang: z.string().trim().min(1).optional(),
  groupSize: z.coerce.number().int().min(1).optional(),
  /** Comma-separated offering ids — the saved-listing feed's way of turning ids back into cards. */
  ids: z.string().trim().min(1).optional(),
});

export type OfferingListQuery = z.infer<typeof offeringListQuerySchema>;

export const offeringSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(OFFERING_CATEGORIES),
  town: z.string(),
  region: z.string(),
  priceCents: z.int(),
  priceUnit: z.enum(PRICE_UNITS),
  durationMin: z.int().nullable(),
  groupMin: z.int(),
  groupMax: z.int().nullable(),
  inclusions: z.array(z.string()),
  photos: z.array(z.string()),
  avgRating: z.number().nullable(),
  reviewCount: z.int(),
  vouchCount: z.int(),
  sustainabilityTag: z.enum(SUSTAINABILITY_TAGS).nullable(),
  hostTier: z.enum(['REGISTERED', 'IDENTITY', 'COMMUNITY']),
  hostFirstName: z.string(),
});

export type OfferingSummary = z.infer<typeof offeringSummarySchema>;

export const offeringListResponseSchema = z.array(offeringSummarySchema);

export const offeringReviewSchema = z.object({
  id: z.string(),
  rating: z.int(),
  comment: z.string().nullable(),
  createdAt: z.iso.datetime(),
  travellerName: z.string(),
});

export type OfferingReview = z.infer<typeof offeringReviewSchema>;

export const offeringDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(OFFERING_CATEGORIES),
  priceCents: z.int(),
  priceUnit: z.enum(PRICE_UNITS),
  durationMin: z.int().nullable(),
  groupMin: z.int(),
  groupMax: z.int().nullable(),
  inclusions: z.array(z.string()),
  steps: z.array(z.string()),
  whatToBring: z.array(z.string()),
  safetyNotes: z.array(z.string()),
  languages: z.array(z.string()),
  availability: z.record(z.string(), z.unknown()),
  meetingPoint: z.string(),
  town: z.string(),
  region: z.string(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  photos: z.array(z.string()),
  avgRating: z.number().nullable(),
  reviewCount: z.int(),
  vouchCount: z.int(),
  sustainabilityTag: z.enum(SUSTAINABILITY_TAGS).nullable(),
  host: z.object({
    fullName: z.string(),
    story: z.string().nullable(),
    serviceArea: z.string(),
    photoUrl: z.string().nullable(),
    tier: z.enum(['REGISTERED', 'IDENTITY', 'COMMUNITY']),
  }),
  reviews: z.array(offeringReviewSchema),
});

export type OfferingDetail = z.infer<typeof offeringDetailSchema>;

/**
 * What a host's client sends to create or replace an offering. Status is never part of this
 * shape — it is server-owned (see `goLiveStatus` in core/services/offering.service.ts).
 * Fields with no server-side default (groupMin, inclusions, photos) are left optional here:
 * Prisma's own column default / implicit `[]` for scalar lists applies when they're omitted.
 */
export const offeringWriteSchema = z.object({
  id: z.string().trim().min(1).max(OFFERING_ID_MAX_LENGTH),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  category: z.enum(OFFERING_CATEGORIES),
  sourceLanguage: z.enum(LANGUAGE_CODES),
  priceCents: z.int().nonnegative(),
  durationMin: z.int().positive().optional(),
  groupMin: z.int().positive().optional(),
  groupMax: z.int().positive().optional(),
  inclusions: z.array(z.string().trim().min(1)).optional(),
  meetingPoint: z.string().trim().min(1),
  town: z.string().trim().min(1),
  region: z.string().trim().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
  photos: z.array(z.url()).optional(),
  availability: z.record(z.string(), z.unknown()),
  transcript: z.string().trim().min(1).optional(),
});

export type OfferingWriteDto = z.infer<typeof offeringWriteSchema>;

/** Every write field but id, all optional — a PATCH must never reset an untouched field. */
export const offeringFieldsPatchSchema = offeringWriteSchema.omit({ id: true }).partial().strict();

export const offeringStatusPatchSchema = z.object({ status: z.enum(['PAUSED', 'LIVE']) }).strict();

/** A PATCH body is either a status toggle or a partial field update, never both. */
export const offeringPatchSchema = z.union([offeringStatusPatchSchema, offeringFieldsPatchSchema]);

export type OfferingFieldsPatchDto = z.infer<typeof offeringFieldsPatchSchema>;
export type OfferingStatusPatchDto = z.infer<typeof offeringStatusPatchSchema>;
export type OfferingPatchDto = z.infer<typeof offeringPatchSchema>;
