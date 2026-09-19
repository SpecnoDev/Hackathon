import type { CSSProperties } from 'react';

const SIZE = 120;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const FULL_PERCENT = 100;

/** A share of a whole, drawn as a ring that fills clockwise from the top. The number sits beside it, never only inside it. */
export const Donut = ({ percent, label }: { percent: number; label: string }) => (
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
);
