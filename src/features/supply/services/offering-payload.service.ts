import type { Availability, LanguageCode, Offering, OfferingKind } from '../interfaces';

/** The Prisma enum from docs/TECH_STACK.md. Kept local until the other agent's schema types land somewhere importable. */
export type ServerOfferingCategory = 'TOUR' | 'FOOD' | 'TRANSPORT' | 'ACCOMMODATION' | 'CONCIERGE' | 'SECURITY';

/**
 * The PRD's kinds are coarser than the schema's categories (food and experience share a client
 * category). Keyed by kind, not by the client OfferingCategory, so food gets its own server category.
 */
const SERVER_CATEGORY_BY_KIND: Record<OfferingKind, ServerOfferingCategory> = {
  experience: 'TOUR',
  transport: 'TRANSPORT',
  guide: 'CONCIERGE',
  food: 'FOOD',
  concierge: 'CONCIERGE',
  security: 'SECURITY',
};

/** No `id`: the PATCH schema strictly omits it (the URL already has it); POST call sites add it back. */
export interface OfferingPayload {
  title: string;
  description: string;
  category: ServerOfferingCategory;
  sourceLanguage: LanguageCode;
  priceCents: number;
  durationMin?: number;
  groupMin: number;
  groupMax?: number;
  inclusions: string[];
  meetingPoint: string;
  town: string;
  region: string;
  lat?: number;
  lng?: number;
  photos: string[];
  availability: Availability;
  transcript?: string;
}

/** Photos stay in IndexedDB for now; uploading the blobs to get back URLs is a follow-up. */
export const toOfferingPayload = (offering: Offering): OfferingPayload => ({
  title: offering.title,
  description: offering.description,
  category: SERVER_CATEGORY_BY_KIND[offering.kind],
  sourceLanguage: offering.sourceLanguage,
  priceCents: offering.priceCents,
  durationMin: offering.durationMin,
  groupMin: offering.groupMin,
  groupMax: offering.groupMax,
  inclusions: offering.inclusions,
  meetingPoint: offering.meetingPoint,
  town: offering.town,
  region: offering.region,
  lat: offering.lat,
  lng: offering.lng,
  photos: [],
  availability: offering.availability,
  transcript: offering.transcript,
});
