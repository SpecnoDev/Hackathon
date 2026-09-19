import type { OfferingCategory } from '@prisma/client';
import { EXPERIENCE_TYPE_LABEL } from '../constants';

/** DESIGN.md gives category tags the orange tint, always with ink on it. */
export const TypePill = ({ category }: { category: OfferingCategory }) => (
  <span className="inline-flex items-center rounded-full bg-accent-tint px-2.5 py-1 text-badge text-ink">{EXPERIENCE_TYPE_LABEL[category]}</span>
);
