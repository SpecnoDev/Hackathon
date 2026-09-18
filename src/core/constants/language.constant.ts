// Type-only: middleware.ts imports this barrel, and a value import of the Prisma client
// there breaks the edge runtime.
import type { Language } from '@prisma/client';

/** Each language named in its own orthography, per DESIGN.md `language-tile`. */
export const LANGUAGE_LABELS: Record<Language, string> = {
  EN: 'English',
  AF: 'Afrikaans',
  XH: 'isiXhosa',
  ZU: 'isiZulu',
};
