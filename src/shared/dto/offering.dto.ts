import { z } from 'zod';

export const OFFERING_CATEGORIES = [
  'TOUR',
  'FOOD',
  'TRANSPORT',
  'ACCOMMODATION',
  'CONCIERGE',
  'SECURITY',
] as const;

export const SUSTAINABILITY_TAGS = ['LOW_IMPACT_TRAVEL', 'SUPPORTS_LOCAL_LIVELIHOODS'] as const;

export const offeringListQuerySchema = z.object({
  region: z.string().trim().min(1).optional(),
  category: z.enum(OFFERING_CATEGORIES).optional(),
  q: z.string().trim().min(1).optional(),
  lang: z.string().trim().min(1).optional(),
  groupSize: z.coerce.number().int().min(1).optional(),
});

export type OfferingListQuery = z.infer<typeof offeringListQuerySchema>;

export const offeringSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.enum(OFFERING_CATEGORIES),
  town: z.string(),
  region: z.string(),
  priceCents: z.int(),
  durationMin: z.int().nullable(),
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
