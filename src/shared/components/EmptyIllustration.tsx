import type { ReactNode } from 'react';

/*
 * The spot illustrations of the design language: flat filled shapes with a 2.5px ink outline, concentric circles and
 * capsules, in the brand's palette. Each drawing names the thing the screen will hold once it is no longer empty.
 */
const OUTLINE = 'fill-none stroke-ink [stroke-width:2.5]';

const DRAWINGS = {
  /** The poster a listing takes: a photo panel with the dots motif standing in for the picture. */
  offerings: (
    <>
      <rect x="16" y="8" width="88" height="80" rx="8" className="fill-ink" />
      <circle cx="43" cy="37" r="15" className="fill-accent" />
      <circle cx="43" cy="37" r="7.5" className="fill-primary" />
      <path d="M69 23 L83 53 H55 Z" className="fill-primary" />
      <rect x="28" y="64" width="64" height="6" rx="3" className="fill-sand" />
      <rect x="28" y="75" width="34" height="6" rx="3" className="fill-sand" opacity="0.5" />
    </>
  ),
  /** A month with one day taken, marked by the orange diamond. */
  bookings: (
    <>
      <rect x="15.5" y="15.5" width="89" height="69" rx="6" className="fill-sand" />
      <path d="M15.5 15.5 H104.5 V33 H15.5 Z" className="fill-ink" />
      <rect x="15.5" y="15.5" width="89" height="69" rx="6" className={OUTLINE} />
      <circle cx="34" cy="50" r="4.5" className="fill-primary" />
      <circle cx="60" cy="50" r="4.5" className="fill-primary" />
      <path d="M86 43.5 L92.5 50 L86 56.5 L79.5 50 Z" className="fill-accent" />
      <circle cx="34" cy="69" r="4.5" className="fill-primary" opacity="0.35" />
      <circle cx="60" cy="69" r="4.5" className="fill-primary" opacity="0.35" />
    </>
  ),
  /** A coin: concentric circles, the shape money takes throughout the app. */
  earnings: (
    <>
      <circle cx="60" cy="48" r="32" className="fill-accent-tint" />
      <circle cx="60" cy="48" r="32" className={OUTLINE} />
      <circle cx="60" cy="48" r="22" className="fill-primary" />
      <circle cx="60" cy="48" r="11" className="fill-sand" />
      <circle cx="60" cy="48" r="4" className="fill-primary" />
    </>
  ),
  /** A magnifier with a thin handle and a lens that found nothing. */
  missing: (
    <>
      <path d="M73 63 L94 84" className="stroke-ink [stroke-linecap:round] [stroke-width:7]" />
      <circle cx="52" cy="42" r="28" className="fill-accent-tint" />
      <circle cx="52" cy="42" r="28" className={OUTLINE} />
      <circle cx="52" cy="42" r="15" className="fill-accent" />
      <path d="M52 34 L60 42 L52 50 L44 42 Z" className="fill-sand" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type EmptyIllustrationName = keyof typeof DRAWINGS;

export const EmptyIllustration = ({ name }: { name: EmptyIllustrationName }) => (
  <svg width="120" height="96" viewBox="0 0 120 96" strokeLinejoin="round" aria-hidden>
    {DRAWINGS[name]}
  </svg>
);
