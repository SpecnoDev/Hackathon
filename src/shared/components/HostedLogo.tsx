const MARK_VIEWBOX = 64;
const MARK_STROKE = 5;
/** One stroke: it starts as the loop around the dot, runs down to the floor, and goes round the house, leaving the doorway open. */
const MARK_LINE = 'M39 31 a7 7 0 1 0 -14 0 a7 7 0 1 0 14 0 v8 c0 10 -6 18 -15 18 H16 a7 7 0 0 1 -7 -7 V26 L32 7 L55 26 V50 a7 7 0 0 1 -7 7 h-5';
const DOT = { cx: 32, cy: 31, r: 3 };
/** The line is drawn from the doorway inwards, so the dot lands once it has found its way home. */
const DOT_LANDS_AFTER_MS = 1300;

interface HostedMarkProps {
  size?: number;
  onDark?: boolean;
  /** Draws the line on, then lands the dot. The splash uses it; everywhere else the mark is still. */
  animated?: boolean;
  className?: string;
}
import type { CSSProperties } from 'react';

type LogoSize = 'md' | 'sm';

/** `md` leads a page; `sm` sits in a 64px bar beside navigation. The two sizes keep the mark and the word in proportion. */
const MARK_PX: Record<LogoSize, number> = { md: 28, sm: 24 };
const WORDMARK_TEXT: Record<LogoSize, string> = { md: 'text-display-md', sm: 'text-title-lg' };

/**
 * The Hosted mark: a home drawn in one continuous green line that curls inside to a single orange dot,
 * the person and the experience at the heart of it. Decorative on its own; pair it with the wordmark or a label.
 */
export const HostedMark = ({ size = MARK_VIEWBOX, onDark = false, animated = false, className }: HostedMarkProps) => (
  <svg width={size} height={size} viewBox={`0 0 ${MARK_VIEWBOX} ${MARK_VIEWBOX}`} fill="none" aria-hidden focusable="false" className={className}>
    <path
      d={MARK_LINE}
      // A path length of 1 lets the draw-on run in fractions, whatever the real length of the line is.
      pathLength={animated ? 1 : undefined}
      strokeWidth={MARK_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={animated ? 1 : undefined}
      className={`${onDark ? 'stroke-on-dark' : 'stroke-primary'} ${animated ? 'animate-mark-draw motion-reduce:animate-none' : ''}`}
      style={animated ? ({ '--mark-dash': '-1' } as CSSProperties) : undefined}
    />
    <circle
      {...DOT}
      className={`fill-accent ${animated ? 'origin-center animate-mark-pop motion-reduce:animate-none' : ''}`}
      style={animated ? { transformBox: 'fill-box', animationDelay: `${DOT_LANDS_AFTER_MS}ms` } : undefined}
    />
  </svg>
);

interface HostedLogoProps {
  name: string;
  size?: LogoSize;
  /** On a dark surface the wordmark is white; on the canvas it is ink. The mark never changes colour. */
  onDark?: boolean;
}

/** Mark and wordmark together, the wordmark in the display face, the same SemiBold as the headings it leads. */
export const HostedLogo = ({ name, size = 'md', onDark = false }: HostedLogoProps) => (
  <span className="inline-flex items-center gap-2">
    <HostedMark size={MARK_PX[size]} onDark={onDark} />
    <span className={`font-display ${WORDMARK_TEXT[size]} ${onDark ? 'text-on-dark' : 'text-ink'}`}>{name}</span>
  </span>
);
