import type { IconName, StatusTone } from '@/shared/components';
import type {
  AvailabilityType,
  BookingStatus,
  CommunityProofType,
  ContactChannel,
  Difficulty,
  DocumentType,
  DraftRowId,
  LanguageCode,
  OfferingCategory,
  OfferingFieldId,
  OfferingKind,
  OfferingStatus,
  PayoutChannel,
  PayoutStatus,
  PriceUnit,
  ResponseReason,
  VerificationTier,
  Weekday,
} from '../interfaces';

/** Language names are written in their own orthography and are never translated. */
export const LANGUAGES: ReadonlyArray<{ code: LanguageCode; name: string; htmlLang: string }> = [
  { code: 'EN', name: 'English', htmlLang: 'en' },
  { code: 'AF', name: 'Afrikaans', htmlLang: 'af' },
  { code: 'XH', name: 'isiXhosa', htmlLang: 'xh' },
  { code: 'ZU', name: 'isiZulu', htmlLang: 'zu' },
];

export const languageName = (code: LanguageCode): string => LANGUAGES.find((language) => language.code === code)?.name ?? code;

export const CONTACT_CHANNELS: ReadonlyArray<{ channel: ContactChannel; icon: IconName }> = [
  { channel: 'WHATSAPP', icon: 'message' },
  { channel: 'SMS', icon: 'smartphone' },
  { channel: 'IN_APP', icon: 'bell' },
];

export const TIER_ORDER: readonly VerificationTier[] = ['REGISTERED', 'IDENTITY', 'COMMUNITY'];

export const DOCUMENT_TYPES: ReadonlyArray<{ type: DocumentType; icon: IconName }> = [
  { type: 'SA_ID', icon: 'id-card' },
  { type: 'PASSPORT', icon: 'globe' },
  { type: 'PERMIT', icon: 'shield' },
];

export const COMMUNITY_PROOFS: ReadonlyArray<{ type: CommunityProofType; icon: IconName }> = [
  { type: 'GUIDE_NUMBER', icon: 'compass' },
  { type: 'OPERATING_LICENCE', icon: 'car' },
  { type: 'PSIRA_NUMBER', icon: 'shield' },
  { type: 'HOST_REFERENCE', icon: 'users' },
  { type: 'ORGANISATION', icon: 'store' },
];

interface KindOption {
  kind: OfferingKind;
  /** The schema has four categories; the host sees friendlier kinds that map onto them. */
  category: OfferingCategory;
  icon: IconName;
  available: boolean;
  extraFields: readonly OfferingFieldId[];
}

export const OFFERING_KINDS: readonly KindOption[] = [
  { kind: 'experience', category: 'EXPERIENCE', icon: 'sun', available: true, extraFields: ['difficulty', 'ageSuitability'] },
  { kind: 'transport', category: 'TRANSPORT', icon: 'car', available: true, extraFields: ['vehicle'] },
  { kind: 'guide', category: 'CONCIERGE', icon: 'compass', available: true, extraFields: ['areasCovered', 'difficulty'] },
  { kind: 'food', category: 'EXPERIENCE', icon: 'utensils', available: true, extraFields: ['dietaryNotes', 'ageSuitability'] },
  { kind: 'concierge', category: 'CONCIERGE', icon: 'concierge', available: true, extraFields: [] },
  { kind: 'security', category: 'SECURITY', icon: 'shield', available: false, extraFields: [] },
];

export const kindOption = (kind: OfferingKind): KindOption =>
  OFFERING_KINDS.find((option) => option.kind === kind) ?? OFFERING_KINDS[0];

/** The order of the drafted-listing stack, which is also the order a traveller reads the listing in. Category extras are appended per kind. */
export const BASE_FIELD_ORDER: readonly OfferingFieldId[] = [
  'title',
  'description',
  'steps',
  'duration',
  'groupSize',
  'price',
  'inclusions',
  'whatToBring',
  'meetingPoint',
  'languages',
];

const DRAFT_ROW_IDS: readonly DraftRowId[] = [
  ...BASE_FIELD_ORDER,
  'difficulty',
  'ageSuitability',
  'vehicle',
  'dietaryNotes',
  'areasCovered',
  'photos',
  'availability',
];

/** DESIGN.md: every host-side icon sits beside its text label, so these never carry meaning alone. */
export const DRAFT_ROW_ICONS: Record<DraftRowId, IconName> = {
  title: 'tag',
  description: 'text',
  steps: 'route',
  duration: 'clock',
  groupSize: 'users',
  price: 'banknote',
  inclusions: 'circle-check',
  whatToBring: 'backpack',
  meetingPoint: 'map-pin',
  languages: 'globe',
  difficulty: 'footprints',
  ageSuitability: 'baby',
  vehicle: 'car',
  dietaryNotes: 'utensils',
  areasCovered: 'map',
  photos: 'camera',
  availability: 'calendar',
};

/** Guards a row name that arrived in a URL. */
export const isDraftRowId = (value: string): value is DraftRowId => (DRAFT_ROW_IDS as readonly string[]).includes(value);

export const draftFieldOrder = (kind: OfferingKind): OfferingFieldId[] => [...BASE_FIELD_ORDER, ...kindOption(kind).extraFields];

/** Screens 16a to 16f: one question each. What is included, languages and category extras are edited on the stack after. */
export const GUIDED_FORM_FIELDS: readonly OfferingFieldId[] = ['title', 'description', 'duration', 'groupSize', 'price', 'meetingPoint'];

export const DURATION_OPTIONS_MIN: readonly number[] = [60, 120, 180, 240, 480];

export const DIFFICULTIES: readonly Difficulty[] = ['EASY', 'MODERATE', 'HARD'];

/** The youngest guest a host takes. */
export const ALL_AGES = 0;
export const ADULT_AGE = 18;
export const MIN_AGE_OPTIONS: readonly number[] = [ALL_AGES, 8, 12, ADULT_AGE];

export const PRICE_UNITS: readonly PriceUnit[] = ['PER_PERSON', 'PER_TRIP'];

/**
 * TODO: placeholders. The PRD wants a range "from category, duration and comparable listings";
 * until there are comparables these are hand-set so the screen has something honest to show.
 */
export const PRICE_GUIDE_CENTS: Record<OfferingKind, { min: number; max: number; unit: PriceUnit }> = {
  experience: { min: 15_000, max: 35_000, unit: 'PER_PERSON' },
  transport: { min: 30_000, max: 60_000, unit: 'PER_TRIP' },
  guide: { min: 20_000, max: 40_000, unit: 'PER_PERSON' },
  food: { min: 40_000, max: 80_000, unit: 'PER_TRIP' },
  concierge: { min: 50_000, max: 150_000, unit: 'PER_TRIP' },
  security: { min: 0, max: 0, unit: 'PER_TRIP' },
};

export const AVAILABILITY_TYPES: ReadonlyArray<{ type: AvailabilityType; icon: IconName }> = [
  { type: 'ON_REQUEST', icon: 'message' },
  { type: 'RECURRING', icon: 'calendar-check' },
  { type: 'DATES', icon: 'calendar' },
];

export const WEEKDAYS: readonly Weekday[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const PAYOUT_CHANNELS: ReadonlyArray<{ channel: PayoutChannel; icon: IconName }> = [
  { channel: 'CASH_SEND', icon: 'smartphone' },
  { channel: 'BANK', icon: 'bank' },
  { channel: 'WALLET', icon: 'wallet' },
  { channel: 'CASH_PICKUP', icon: 'store' },
];

export const WALLET_PROVIDERS: readonly string[] = ['MTN MoMo', 'VodaPay', 'Shoprite Money Market'];
export const PICKUP_SHOPS: readonly string[] = ['Shoprite', 'Pick n Pay', 'Boxer', 'Pep'];
export const BANKS: readonly string[] = ['Capitec', 'FNB', 'Standard Bank', 'Absa', 'Nedbank', 'TymeBank'];

export const RESPONSE_REASONS: readonly ResponseReason[] = ['NOT_AVAILABLE', 'TOO_MANY_PEOPLE', 'SOMETHING_CAME_UP', 'OTHER'];

export const OFFERING_STATUS_TONE: Record<OfferingStatus, StatusTone> = {
  DRAFT: 'draft',
  IN_REVIEW: 'review',
  LIVE: 'live',
  PAUSED: 'paused',
  REJECTED: 'rejected',
};

/**
 * DESIGN.md has no booking or payout pills yet (Known Gaps), so these reuse the five offering
 * treatments with their own glyphs rather than inventing a sixth.
 */
export const BOOKING_STATUS_PILL: Record<BookingStatus, { tone: StatusTone; icon: IconName }> = {
  REQUESTED: { tone: 'review', icon: 'clock' },
  CONFIRMED: { tone: 'live', icon: 'calendar-check' },
  DECLINED: { tone: 'rejected', icon: 'x' },
  COMPLETED: { tone: 'live', icon: 'check' },
  CANCELLED: { tone: 'paused', icon: 'x' },
};

export const PAYOUT_STATUS_PILL: Record<PayoutStatus, { tone: StatusTone; icon: IconName }> = {
  PENDING: { tone: 'review', icon: 'clock' },
  SENT: { tone: 'live', icon: 'banknote' },
};

/** TODO: placeholder. There is no support number in the repo yet. */
export const SUPPORT_WHATSAPP_NUMBER = '+27600000000';
