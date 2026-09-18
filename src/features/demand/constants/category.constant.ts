import type { IconName } from '@/shared/components';
import { OFFERING_CATEGORIES } from '@/shared/dto';

type Category = (typeof OFFERING_CATEGORIES)[number];

/** The chip strip, in the order the design brief gives. Real enum values — no prototype-only "EXPERIENCE" category. */
export const CATEGORY_ICON: Record<Category, IconName> = {
  TOUR: 'sun',
  FOOD: 'utensils',
  GUIDE: 'compass',
  TRANSPORT: 'car',
  ACCOMMODATION: 'bank',
  CONCIERGE: 'concierge',
  SECURITY: 'shield',
};

export const CATEGORY_LABEL: Record<Category, string> = {
  TOUR: 'Tours',
  FOOD: 'Food',
  GUIDE: 'Guides',
  TRANSPORT: 'Transport',
  ACCOMMODATION: 'Accommodation',
  CONCIERGE: 'Concierge',
  SECURITY: 'Security',
};
