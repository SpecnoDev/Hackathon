/** Enum values match the Prisma enums in docs/TECH_STACK.md where one exists, so the demo store can be swapped for real services. */
export type LanguageCode = 'EN' | 'AF' | 'XH' | 'ZU';
export type VerificationTier = 'REGISTERED' | 'IDENTITY' | 'COMMUNITY';
export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
/** What the chip strip shows. Food and guides are their own chips for travellers, though the schema files both under wider categories. */
export type ListingCategory = 'EXPERIENCE' | 'FOOD' | 'GUIDE' | 'TRANSPORT';
export type PriceUnit = 'PER_PERSON' | 'PER_TRIP';
export type BookingMode = 'INSTANT' | 'ON_REQUEST';
export type TripStatus = 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CARD' | 'INSTANT_EFT' | 'QR' | 'WALLET';
export type CancelReason = 'PLANS_CHANGED' | 'FOUND_SOMETHING_ELSE' | 'WEATHER' | 'OTHER';
export type ApproxCurrency = 'USD' | 'EUR' | 'GBP';
export type RefundKind = 'FULL' | 'PARTIAL' | 'NONE';

export interface TravellerHost {
  id: string;
  firstName: string;
  town: string;
  tier: VerificationTier;
  portrait: string;
  /** First of the month they joined, ISO. */
  memberSince: string;
  languages: LanguageCode[];
  story: string;
  voiceNoteSeconds: number;
}

export interface ListingAvailability {
  /** Empty means any day, by arrangement. */
  weekdays: Weekday[];
  /** "HH:MM" start times. Empty means the host confirms a time. */
  times: string[];
}

export interface Listing {
  id: string;
  hostId: string;
  placeSlug: string;
  category: ListingCategory;
  title: string;
  description: string;
  photos: string[];
  town: string;
  priceCents: number;
  priceUnit: PriceUnit;
  durationMin: number;
  groupMin: number;
  groupMax: number;
  languages: LanguageCode[];
  inclusions: string[];
  /** The PRD's "what to expect". */
  steps: string[];
  whatToBring: string[];
  safetyNotes: string[];
  meetingPoint: string;
  bookingMode: BookingMode;
  availability: ListingAvailability;
  /** How many travellers gave 5, 4, 3, 2 and 1 stars. The average and the count are read from this, never stored twice. */
  ratings: [number, number, number, number, number];
  addedAt: string;
}

export interface Review {
  id: string;
  listingId: string;
  travellerName: string;
  travellerFrom: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Place {
  slug: string;
  name: string;
  region: string;
  photo: string;
  blurb: string;
}

export interface GuestDetails {
  name: string;
  phone: string;
  whatsAppOptIn: boolean;
  language: LanguageCode;
}

export interface BookingDraft {
  listingId: string;
  /** ISO date, "YYYY-MM-DD". */
  date?: string;
  /** "HH:MM", or null when the host will confirm a time. */
  time?: string | null;
  guests: number;
  guest?: GuestDetails;
  paymentMethod?: PaymentMethod;
}

export interface Trip {
  id: string;
  listingId: string;
  status: TripStatus;
  date: string;
  time: string | null;
  guests: number;
  subtotalCents: number;
  serviceFeeCents: number;
  totalCents: number;
  paymentMethod: PaymentMethod;
  guest: GuestDetails;
  createdAt: string;
  /** REQUESTED only: when the hold is released if the host has not answered. */
  respondBy?: string;
  rescheduleRequested?: boolean;
  cancelledAt?: string;
  cancelReason?: CancelReason;
  refundCents?: number;
  reviewed: boolean;
}

export interface PlanItem {
  id: string;
  listingId: string;
  /** 1-based day of the plan. */
  day: number;
  tripId?: string;
}

export interface Plan {
  id: string;
  name: string;
  items: PlanItem[];
}

export interface SearchState {
  placeSlug?: string;
  date?: string;
  guests: number;
  /** The natural-language line, kept as typed. */
  query: string;
  recent: string[];
}

export interface Filters {
  category?: ListingCategory;
  maxPriceCents?: number;
  maxDurationMin?: number;
  language?: LanguageCode;
  verifiedOnly: boolean;
  instantOnly: boolean;
}

export interface NotificationSettings {
  bookings: boolean;
  reminders: boolean;
  reviews: boolean;
}

export interface TravellerProfile {
  signedIn: boolean;
  firstName: string;
  phone: string;
  language: LanguageCode;
  showApproxCurrency: boolean;
  approxCurrency: ApproxCurrency;
  notifications: NotificationSettings;
}

export interface SignInProgress {
  phone?: string;
  codeSentAt?: string;
  /** Where to send the traveller once they are in, e.g. back to the payment step. */
  returnTo?: string;
}

export interface NewReview {
  rating: number;
  text: string;
  privateNote: string;
  photoName?: string;
}

export interface TravellerAppState {
  schemaVersion: number;
  profile: TravellerProfile;
  signIn: SignInProgress;
  search: SearchState;
  filters: Filters;
  savedIds: string[];
  booking?: BookingDraft;
  trips: Trip[];
  plans: Plan[];
  /** Reviews this traveller wrote, shown with the seeded ones. */
  reviews: Review[];
}
