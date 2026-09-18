import { DEFAULT_GROUP_MAX, kindOption } from '../constants';
import type {
  Availability,
  ContactChannel,
  Host,
  LanguageCode,
  Offering,
  OfferingKind,
  OfferingStatus,
  PayoutChannel,
  VerificationTier,
} from '../interfaces';

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

/**
 * Inverse of SERVER_CATEGORY_BY_KIND. Not a clean inverse: two client kinds (guide, concierge)
 * both write CONCIERGE, and ACCOMMODATION is never written by this client at all. CONCIERGE reads
 * back as 'guide' — the friendlier, more commonly picked of the two — and ACCOMMODATION, having no
 * client kind, reads back as 'experience'.
 */
const KIND_BY_SERVER_CATEGORY: Record<ServerOfferingCategory, OfferingKind> = {
  TOUR: 'experience',
  FOOD: 'food',
  TRANSPORT: 'transport',
  CONCIERGE: 'guide',
  SECURITY: 'security',
  ACCOMMODATION: 'experience',
};

/** Same five values as the client OfferingStatus (see interfaces/host-app.interface.ts) — an identity mapping, kept as a function so the two enums can drift without a silent mismatch. */
const fromServerStatus = (status: OfferingStatus): OfferingStatus => status;

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

/** A full Prisma Offering row, as returned by GET /hosts/me/offerings (dates already serialized to ISO strings over JSON). */
export interface OfferingRow {
  id: string;
  hostId: string;
  category: ServerOfferingCategory;
  status: OfferingStatus;
  title: string;
  description: string;
  sourceLanguage: LanguageCode;
  translations?: unknown;
  priceCents: number;
  durationMin?: number | null;
  groupMin: number;
  groupMax?: number | null;
  inclusions: string[];
  meetingPoint: string;
  town: string;
  region: string;
  lat?: number | null;
  lng?: number | null;
  photos: string[];
  availability: unknown;
  voiceNotePath?: string | null;
  transcript?: string | null;
  vouchCount: number;
  avgRating?: number | null;
  reviewCount: number;
  sustainabilityTag?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * The server is authoritative for everything it has, including status. Fields the server doesn't
 * store yet (photos are local blob keys, not the server's uploaded URLs; steps, whatToBring,
 * priceUnit, languages, details, voiceNoteKey, statusReason, views are purely client-side) come
 * from the matching local row when there is one, else the same defaults emptyFields() gives a
 * brand-new draft in host-app.store.ts.
 */
export const fromOfferingRow = (row: OfferingRow, local?: Offering): Offering => {
  const kind = KIND_BY_SERVER_CATEGORY[row.category];
  return {
    kind,
    id: row.id,
    hostId: row.hostId,
    category: kindOption(kind).category,
    sourceLanguage: row.sourceLanguage,
    status: fromServerStatus(row.status),
    statusReason: local?.statusReason,
    title: row.title,
    description: row.description,
    steps: local?.steps ?? [],
    durationMin: row.durationMin ?? local?.durationMin ?? 0,
    groupMin: row.groupMin,
    groupMax: row.groupMax ?? local?.groupMax ?? DEFAULT_GROUP_MAX,
    priceCents: row.priceCents,
    priceUnit: local?.priceUnit ?? 'PER_PERSON',
    inclusions: row.inclusions,
    whatToBring: local?.whatToBring ?? [],
    meetingPoint: row.meetingPoint,
    town: row.town,
    region: row.region,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    languages: local?.languages ?? (row.sourceLanguage === 'EN' ? ['EN'] : [row.sourceLanguage, 'EN']),
    photos: local?.photos ?? [],
    availability: (row.availability as Availability | undefined) ?? local?.availability ?? { type: 'ON_REQUEST', dates: [], weekdays: [] },
    details: local?.details ?? {},
    voiceNoteKey: local?.voiceNoteKey,
    voiceNoteSeconds: local?.voiceNoteSeconds,
    transcript: row.transcript ?? undefined,
    views: local?.views ?? 0,
    pendingSync: false,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
};

/** GET /hosts/me's shape — the safe host columns, no idNumberHash or idDocumentPath. */
export interface HostProfileRow {
  id: string;
  phone: string;
  fullName: string;
  language: LanguageCode;
  contactChannel: ContactChannel;
  serviceArea: string;
  story: string | null;
  tier: VerificationTier;
  payoutChannel: PayoutChannel | null;
  payoutPhone: string | null;
}

/**
 * `serviceArea` is one free-text column; the client splits it into town/region on the last comma
 * ("Langa, Cape Town" -> town "Langa", region "Cape Town" — the shape the DB seed and the traveller
 * region filter both use). A value with no comma is treated as just the town, keeping whatever
 * region the local copy already had rather than blanking a working traveller-search match.
 */
const splitServiceArea = (serviceArea: string, local?: Host): { town: string; region: string } => {
  const parts = serviceArea
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 2) return { town: parts.slice(0, -1).join(', '), region: parts[parts.length - 1] };
  return { town: parts[0] ?? local?.town ?? '', region: local?.region ?? '' };
};

/** Client-only fields (notifications, payoutDetails, communityProof) come from the local copy when there is one, else completeRegistration()'s own defaults for a brand-new host. */
export const fromHostProfile = (profile: HostProfileRow, local?: Host): Host => {
  const { town, region } = splitServiceArea(profile.serviceArea, local);
  return {
    id: profile.id,
    phone: profile.phone,
    firstName: profile.fullName.trim().split(/\s+/)[0] ?? '',
    language: profile.language,
    contactChannel: profile.contactChannel,
    notifications: local?.notifications ?? { WHATSAPP: true, SMS: true, IN_APP: true },
    town,
    region,
    story: profile.story ?? '',
    tier: profile.tier,
    payoutChannel: profile.payoutChannel ?? local?.payoutChannel ?? 'CASH_SEND',
    payoutDetails: local?.payoutDetails ?? { phone: profile.payoutPhone ?? profile.phone },
    communityProof: local?.communityProof,
  };
};
