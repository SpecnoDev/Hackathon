import type { CSSProperties, ReactNode } from 'react';
import { PatternField } from '@/shared/components';
import { DECK_IMAGES, STAGGER_MS } from '../constants';

export type SlideTone = 'dark' | 'green' | 'light' | 'brand';

/** The drawn pattern bleeds in from the right edge, behind a mockup, and fades out before it reaches the words. */
const EDGE_WIDTH_PX = 300;
const EDGE_OPACITY = 0.06;
const EDGE_FADE = 'linear-gradient(to left, #000 0%, #000 45%, transparent 100%)';

const EdgePattern = () => (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-y-0 right-0"
    style={{
      width: EDGE_WIDTH_PX,
      opacity: EDGE_OPACITY,
      backgroundImage: `url(${DECK_IMAGES.slideEdge})`,
      backgroundSize: 'cover',
      backgroundPosition: 'right center',
      maskImage: EDGE_FADE,
      WebkitMaskImage: EDGE_FADE,
    }}
  />
);

/** DESIGN.md: the dark surface, the app's green hero, the warm canvas, and the one bright green. Nothing else is a slide background. */
const TONE: Record<SlideTone, string> = {
  dark: 'bg-surface-dark text-on-dark',
  green: 'bg-primary-deep text-on-dark',
  light: 'bg-canvas text-ink',
  brand: 'bg-primary text-on-primary',
};

const EYEBROW: Record<SlideTone, string> = {
  dark: 'text-accent',
  green: 'text-accent',
  light: 'text-primary-text',
  brand: 'text-on-primary/80',
};

const SOURCE: Record<SlideTone, string> = {
  dark: 'text-on-dark/50',
  green: 'text-on-dark/60',
  light: 'text-muted',
  brand: 'text-on-primary/70',
};

/** One step of the entrance: each element rises in a beat after the one before it. Still with reduced motion. */
export const Reveal = ({ order = 0, className = '', children }: { order?: number; className?: string; children: ReactNode }) => (
  <div className={`animate-deck-rise motion-reduce:animate-none ${className}`} style={{ animationDelay: `${order * STAGGER_MS}ms` } satisfies CSSProperties}>
    {children}
  </div>
);

interface SlideProps {
  tone: SlideTone;
  eyebrow?: string;
  /** Slides with a mockup on the right take the drawn pattern behind it. */
  edge?: boolean;
  headline?: ReactNode;
  /** Where the figures on this slide came from. Small, but always there. */
  source?: string;
  children: ReactNode;
}

/**
 * The eyebrow and the headline. Normally the slide draws it across the top; a slide whose right half is a mockup
 * puts it at the head of its text column instead, so the phone gets the full height of the slide.
 */
export const SlideHeading = ({ tone, eyebrow, headline }: { tone: SlideTone; eyebrow?: string; headline?: ReactNode }) => (
  <header className="flex flex-col gap-3">
    {eyebrow ? (
      <Reveal>
        <p className={`text-badge uppercase tracking-[0.22em] ${EYEBROW[tone]}`}>{eyebrow}</p>
      </Reveal>
    ) : null}
    {headline ? (
      <Reveal order={1}>
        <h2 className="max-w-3xl font-display text-display-xl">{headline}</h2>
      </Reveal>
    ) : null}
  </header>
);

export const Slide = ({ tone, eyebrow, headline, source, edge = false, children }: SlideProps) => (
  <section className={`relative flex size-full flex-col gap-5 overflow-hidden px-14 pb-6 pt-10 ${TONE[tone]}`}>
    {tone === 'green' || tone === 'brand' ? <PatternField /> : null}
    {edge ? <EdgePattern /> : null}
    {eyebrow || headline ? <SlideHeading tone={tone} eyebrow={eyebrow} headline={headline} /> : null}
    <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    {source ? <p className={`text-[0.625rem] leading-snug ${SOURCE[tone]}`}>{source}</p> : null}
  </section>
);
