import type { ReactNode } from 'react';

/*
 * DESIGN.md: a simple line illustration in a neutral stroke with exactly one green stroke.
 * Each drawing names the thing the screen will hold once it is no longer empty.
 */
const NEUTRAL = 'stroke-border-strong';
const ACCENT = 'stroke-primary';

const DRAWINGS = {
  /** A listing card waiting for its first offering, with a green plus. */
  offerings: (
    <>
      <rect x="18" y="10" width="84" height="76" rx="10" className={NEUTRAL} />
      <rect x="28" y="20" width="64" height="34" rx="6" className={NEUTRAL} />
      <path d="M28 66h40M28 76h24" className={NEUTRAL} />
      <circle cx="98" cy="78" r="14" className={`${ACCENT} fill-canvas`} />
      <path d="M98 71v14M91 78h14" className={ACCENT} />
    </>
  ),
  /** A calendar with one day ticked in green. */
  bookings: (
    <>
      <rect x="20" y="16" width="80" height="68" rx="10" className={NEUTRAL} />
      <path d="M20 36h80M42 8v16M78 8v16" className={NEUTRAL} />
      <path d="M36 52h8M56 52h8M76 52h8M36 68h8" className={NEUTRAL} />
      <path d="m56 68 6 6 12-13" className={ACCENT} />
    </>
  ),
  /** A phone receiving money: the green arrow lands on it. */
  earnings: (
    <>
      <rect x="40" y="6" width="44" height="84" rx="9" className={NEUTRAL} />
      <path d="M56 80h12" className={NEUTRAL} />
      <rect x="6" y="34" width="40" height="26" rx="5" className={`${NEUTRAL} fill-canvas`} />
      <circle cx="26" cy="47" r="6" className={NEUTRAL} />
      <path d="M62 30v26m-9-9 9 9 9-9" className={ACCENT} />
    </>
  ),
  /** A magnifier that found nothing. */
  missing: (
    <>
      <circle cx="54" cy="44" r="26" className={NEUTRAL} />
      <path d="m74 64 22 22" className={NEUTRAL} />
      <path d="M46 44h16" className={ACCENT} />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type EmptyIllustrationName = keyof typeof DRAWINGS;

export const EmptyIllustration = ({ name }: { name: EmptyIllustrationName }) => (
  <svg width="120" height="96" viewBox="0 0 120 96" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {DRAWINGS[name]}
  </svg>
);
