/** Enum values match the Prisma enums in docs/TECH_STACK.md so the demo store can be swapped for real services. */
export type LanguageCode = 'EN' | 'AF' | 'XH' | 'ZU';
export type ContactChannel = 'WHATSAPP' | 'SMS' | 'IN_APP';
export type VerificationTier = 'REGISTERED' | 'IDENTITY' | 'COMMUNITY';
export type OfferingCategory = 'EXPERIENCE' | 'TRANSPORT' | 'CONCIERGE' | 'SECURITY';
export type OfferingStatus = 'DRAFT' | 'IN_REVIEW' | 'LIVE' | 'PAUSED' | 'REJECTED';
export type BookingStatus = 'REQUESTED' | 'CONFIRMED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';
export type PayoutChannel = 'BANK' | 'CASH_SEND' | 'WALLET' | 'CASH_PICKUP';
export type PayoutStatus = 'PENDING' | 'SENT';

/** What the host picks on the category screen. Several kinds share one schema category (food is an EXPERIENCE). */
export type OfferingKind = 'experience' | 'transport' | 'guide' | 'food' | 'concierge' | 'security';
export type PriceUnit = 'PER_PERSON' | 'PER_TRIP';
export type AvailabilityType = 'ON_REQUEST' | 'DATES' | 'RECURRING';
export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
export type DocumentType = 'SA_ID' | 'PASSPORT' | 'PERMIT';
export type VerificationState = 'IDLE' | 'CHECKING' | 'VERIFIED' | 'FAILED';
export type VerificationOutcome = 'VERIFIED' | 'FAILED';
export type CommunityProofType = 'GUIDE_NUMBER' | 'PSIRA_NUMBER' | 'OPERATING_LICENCE' | 'HOST_REFERENCE' | 'ORGANISATION';
export type ResponseReason = 'NOT_AVAILABLE' | 'TOO_MANY_PEOPLE' | 'SOMETHING_CAME_UP' | 'OTHER';
export type PublishOutcome = 'LIVE' | 'WAITING_TO_UPLOAD' | 'NEEDS_ID' | 'NEEDS_LICENCE';
export type CaptureKind = 'document' | 'selfie';
/** The PRD's "physical difficulty" for experiences. */
export type Difficulty = 'EASY' | 'MODERATE' | 'HARD';

export type OfferingFieldId =
  | 'title'
  | 'description'
  | 'steps'
  | 'duration'
  | 'groupSize'
  | 'price'
  | 'inclusions'
  | 'whatToBring'
  | 'meetingPoint'
  | 'region'
  | 'languages'
  | 'difficulty'
  | 'ageSuitability'
  | 'vehicle'
  | 'dietaryNotes'
  | 'areasCovered';

/** A row on the drafted-listing stack. Photos and availability are rows only when editing an existing offering. */
export type DraftRowId = OfferingFieldId | 'photos' | 'availability';

export interface OfferingPhoto {
  /** Key of the compressed image in the local blob store. */
  key: string;
  bytes: number;
}

export interface Availability {
  type: AvailabilityType;
  dates: string[];
  weekdays: Weekday[];
}

export interface OfferingDetails {
  vehicle?: string;
  seats?: number;
  dietaryNotes?: string;
  areasCovered?: string;
  difficulty?: Difficulty;
  /** The PRD's "age suitability": the youngest guest the host takes. 0 means all ages. */
  minAge?: number;
}

/** Everything a host can say or edit about a listing. Shared by live offerings and unfinished drafts. */
export interface OfferingFields {
  kind: OfferingKind;
  title: string;
  description: string;
  /** The PRD's "what to expect" safety note: the visit in order, one short line per step. */
  steps: string[];
  durationMin: number;
  groupMin: number;
  groupMax: number;
  priceCents: number;
  priceUnit: PriceUnit;
  inclusions: string[];
  whatToBring: string[];
  meetingPoint: string;
  town: string;
  /** Host-chosen, from REGION_OPTIONS; drives the traveller region filter (`listLiveRegions()`), so it must match the seeded values. */
  region: string;
  lat?: number;
  lng?: number;
  languages: LanguageCode[];
  photos: OfferingPhoto[];
  availability: Availability;
  details: OfferingDetails;
  voiceNoteKey?: string;
  voiceNoteSeconds?: number;
  transcript?: string;
}

export interface Offering extends OfferingFields {
  id: string;
  hostId: string;
  category: OfferingCategory;
  sourceLanguage: LanguageCode;
  status: OfferingStatus;
  /** Plain-language reason for REJECTED, IN_REVIEW, or a DRAFT that cannot go live yet. */
  statusReason?: string;
  /** Bookings and earnings per offering are derived from the booking records, never stored twice. */
  views: number;
  pendingSync: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DraftSource = 'voice' | 'typed' | 'edit';

export interface OfferingDraft {
  key: string;
  source: DraftSource;
  /** Set when the draft is an edit of an existing offering. */
  offeringId?: string;
  fields: OfferingFields;
  /** True once the host has been through the draft at least once, so the flow can resume at the right screen. */
  drafted: boolean;
  updatedAt: string;
}

export interface GroupPayment {
  paid: number;
  of: number;
}

export interface Booking {
  id: string;
  offeringId: string;
  hostId: string;
  travellerName: string;
  /** The server's booking read model does not carry the traveller's number yet — only set for locally seeded/demo bookings. */
  travellerPhone?: string;
  status: BookingStatus;
  date: string;
  groupSize: number;
  totalCents: number;
  feeCents: number;
  hostReceivesCents: number;
  respondBy: string;
  /** PRD: a group fills a shared pot. The host sees whether the money is all in. */
  groupPayment: GroupPayment;
  responseReason?: ResponseReason;
  pendingSync: boolean;
  createdAt: string;
}

export interface Payout {
  id: string;
  bookingId: string;
  hostId: string;
  amountCents: number;
  channel: PayoutChannel;
  /** Already masked, e.g. "082 *** 4471". */
  destination: string;
  status: PayoutStatus;
  /** The server's payout read model does not track an ETA yet — set for locally seeded/demo payouts and the local mark-completed flow. */
  expectedBy?: string;
  sentAt?: string;
  /** Demo only: when the mocked payout flips to SENT. */
  autoSendAt?: string;
}

export interface PayoutDetails {
  phone?: string;
  bankName?: string;
  accountNumber?: string;
  walletProvider?: string;
  pickupShop?: string;
}

export interface CommunityProof {
  type: CommunityProofType;
  value: string;
  submittedAt: string;
}

export interface Host {
  id: string;
  phone: string;
  firstName: string;
  language: LanguageCode;
  contactChannel: ContactChannel;
  notifications: Record<ContactChannel, boolean>;
  town: string;
  region: string;
  story: string;
  tier: VerificationTier;
  payoutChannel: PayoutChannel;
  payoutDetails: PayoutDetails;
  communityProof?: CommunityProof;
}

/** Saved as the host goes, so registration can be resumed. An unset field is a question not answered yet. */
export interface RegistrationProgress {
  language?: LanguageCode;
  phone?: string;
  codeSentAt?: string;
  codeConfirmed?: boolean;
  /** Set once the server confirms the OTP; becomes the Host's id so a resumed session cannot duplicate it. */
  hostId?: string;
  firstName?: string;
  contactChannel?: ContactChannel;
  completedAt?: string;
}

export interface VerificationProgress {
  documentType?: DocumentType;
  documentPhotoKey?: string;
  selfieKey?: string;
  state: VerificationState;
  resolveAt?: string;
}

/** Shape from docs/TECH_STACK.md ("outbox"): a write waiting for signal, replayed against /api/v1. */
export interface OutboxEntry {
  id: string;
  /** F4: whoever was signed in when the write was queued — `replayOutbox` only sends a match for `activeHostId`. */
  hostId: string;
  method: 'POST' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  attempts: number;
}

export interface PublishResult {
  offeringId: string;
  outcome: PublishOutcome;
}

export interface HostAppState {
  schemaVersion: number;
  /** Undefined on a fresh device: no one has registered or signed in yet. */
  activeHostId: string | undefined;
  hosts: Host[];
  offerings: Offering[];
  bookings: Booking[];
  payouts: Payout[];
  registration: RegistrationProgress;
  verification: VerificationProgress;
  drafts: Record<string, OfferingDraft>;
  lastPublished?: PublishResult;
  outbox: OutboxEntry[];
  demo: { verificationOutcome: VerificationOutcome };
}
