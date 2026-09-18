import type { BottomNavItem, IconName, StatusTone } from '@/shared/components';
import type { ApproxCurrency, CancelReason, LanguageCode, ListingCategory, PaymentMethod, TripStatus, VerificationTier, Weekday } from '../interfaces';
import { TRAVELLER_ROUTES } from './traveller-routes.constant';

/** The chip strip, in the order the brief gives. "All" is the absence of a category. */
export const CATEGORIES: ReadonlyArray<{ category: ListingCategory; icon: IconName }> = [
  { category: 'EXPERIENCE', icon: 'sun' },
  { category: 'FOOD', icon: 'utensils' },
  { category: 'GUIDE', icon: 'compass' },
  { category: 'TRANSPORT', icon: 'car' },
];

export const categoryIcon = (category: ListingCategory): IconName => CATEGORIES.find((item) => item.category === category)?.icon ?? 'sun';

/** Language names are written in their own orthography and are never translated. */
export const LANGUAGES: ReadonlyArray<{ code: LanguageCode; name: string }> = [
  { code: 'EN', name: 'English' },
  { code: 'AF', name: 'Afrikaans' },
  { code: 'XH', name: 'isiXhosa' },
  { code: 'ZU', name: 'isiZulu' },
];

export const languageName = (code: LanguageCode): string => LANGUAGES.find((language) => language.code === code)?.name ?? code;

export const WEEKDAY_ORDER: readonly Weekday[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/** Tiers that carry a badge. A registered host is listed without one. */
export const VERIFIED_TIERS: readonly VerificationTier[] = ['IDENTITY', 'COMMUNITY'];

export const PAYMENT_METHODS: ReadonlyArray<{ method: PaymentMethod; icon: IconName }> = [
  { method: 'CARD', icon: 'credit-card' },
  { method: 'INSTANT_EFT', icon: 'bank' },
  { method: 'QR', icon: 'qr-code' },
  { method: 'WALLET', icon: 'smartphone' },
];

export const CANCEL_REASONS: readonly CancelReason[] = ['PLANS_CHANGED', 'FOUND_SOMETHING_ELSE', 'WEATHER', 'OTHER'];

export const APPROX_CURRENCIES: readonly ApproxCurrency[] = ['USD', 'EUR', 'GBP'];

export const PRICE_FILTER_STEPS_CENTS: readonly number[] = [20_000, 35_000, 50_000, 100_000];
export const DURATION_FILTER_STEPS_MIN: readonly number[] = [90, 120, 180, 240];

/** DESIGN.md has five pill treatments; trip states reuse them with their own glyphs rather than adding a sixth. */
export const TRIP_STATUS_PILL: Record<TripStatus, { tone: StatusTone; icon: IconName }> = {
  REQUESTED: { tone: 'review', icon: 'clock' },
  CONFIRMED: { tone: 'live', icon: 'calendar-check' },
  COMPLETED: { tone: 'live', icon: 'check' },
  CANCELLED: { tone: 'paused', icon: 'x' },
};

/** DESIGN.md bottom-nav, traveller tabs: the same bar as the host app, so both sides read as one product. */
export const TRAVELLER_NAV: BottomNavItem[] = [
  { href: TRAVELLER_ROUTES.home, label: 'Explore', icon: 'search' },
  { href: TRAVELLER_ROUTES.trips.list, label: 'Trips', icon: 'route' },
  { href: TRAVELLER_ROUTES.saved, label: 'Saved', icon: 'heart' },
  { href: TRAVELLER_ROUTES.profile, label: 'Profile', icon: 'user' },
];

/** South African emergency numbers, as dialled from a cellphone. */
export const EMERGENCY_NUMBERS: ReadonlyArray<{ key: 'any' | 'police' | 'ambulance'; number: string }> = [
  { key: 'any', number: '112' },
  { key: 'police', number: '10111' },
  { key: 'ambulance', number: '10177' },
];

/** TODO: placeholder. There is no support number in the repo yet. */
export const SUPPORT_WHATSAPP_NUMBER = '+27600000000';

/** TODO: hand-set driving times between the seeded places, until a routing service exists. Keys are two place slugs in alphabetical order. */
export const DRIVE_MINUTES: Record<string, number> = {
  'cape-town|montagu': 130,
  'cape-town|knysna': 320,
  'cape-town|graaff-reinet': 430,
  'knysna|montagu': 220,
  'graaff-reinet|knysna': 240,
  'graaff-reinet|montagu': 320,
  'durban|soweto': 360,
  'graaff-reinet|soweto': 510,
};
