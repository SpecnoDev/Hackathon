import type { OfferingCategory } from '@prisma/client';

export const DEFAULT_OFFERING_CATEGORY = 'CONCIERGE' satisfies OfferingCategory;

/** The bot's extraction returns a free-text trade, so it is matched to a category by keyword. */
export const OFFERING_CATEGORY_KEYWORDS = {
  TOUR: ['tour', 'guide', 'hike', 'walk', 'safari', 'township', 'experience', 'surf', 'craft'],
  FOOD: ['food', 'cook', 'chef', 'meal', 'braai', 'cater', 'bake', 'restaurant', 'kitchen'],
  TRANSPORT: ['transport', 'driver', 'drive', 'shuttle', 'taxi', 'transfer', 'lift'],
  ACCOMMODATION: ['accommodation', 'stay', 'room', 'lodge', 'bnb', 'camp', 'homestay'],
  CONCIERGE: ['concierge', 'errand', 'arrange', 'plan', 'translate', 'booking'],
  SECURITY: ['security', 'guard', 'escort', 'safety'],
} as const satisfies Record<OfferingCategory, readonly string[]>;

export const AVAILABILITY_ON_REQUEST = { type: 'on_request' } as const;

export const OFFERING_LIST_DEFAULT_TAKE = 24;
export const OFFERING_LIST_MAX_TAKE = 60;
/** The client's id generator falls back to a 32-char hex string over plain HTTP; 64 leaves headroom. */
export const OFFERING_ID_MAX_LENGTH = 64;

export const CENTS_PER_RAND = 100;
