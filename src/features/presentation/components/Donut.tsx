import type { CSSProperties, ReactNode } from 'react';

const SIZE = 132;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const FULL_PERCENT = 100;

/** A share of a whole, drawn as a fine ring that fills clockwise from the top, with the figure inside it. */
export const Donut = ({ percent, label, children }: { percent: number; label: string; children?: ReactNode }) => (
  <span className="relative inline-flex shrink-0 items-center justify-center">
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={label} className="-rotate-90">
      <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" strokeWidth={STROKE} className="stroke-surface-strong" />
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        className="animate-deck-ring stroke-primary motion-reduce:animate-none"
        style={
          {
            '--deck-dash': `${CIRCUMFERENCE}`,
            '--deck-dash-to': `${CIRCUMFERENCE * (1 - percent / FULL_PERCENT)}`,
            strokeDashoffset: CIRCUMFERENCE * (1 - percent / FULL_PERCENT),
            animationDelay: '500ms',
          } as CSSProperties
        }
      />
    </svg>
    {children ? <span className="absolute inset-0 flex items-center justify-center">{children}</span> : null}
  </span>
);
