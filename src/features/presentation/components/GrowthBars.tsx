import type { CSSProperties } from 'react';

interface GrowthBar {
  label: string;
  value: number;
  display: string;
  highlight?: boolean;
  note?: string;
}

const FULL_PERCENT = 100;
const BAR_DELAY_MS = 350;

/** Bars drawn to one scale, growing from the left. The longest bar sets the scale, so the difference is honest. */
export const GrowthBars = ({ bars, onDark = false }: { bars: GrowthBar[]; onDark?: boolean }) => {
  const max = Math.max(...bars.map((bar) => bar.value));
  return (
    <ul className="flex flex-col gap-4">
      {bars.map((bar, index) => (
        <li key={bar.label} className="flex items-center gap-4">
          <span className="w-24 shrink-0 text-title-sm opacity-80">
            {bar.label}
            {bar.note ? <span className="block text-badge opacity-70">{bar.note}</span> : null}
          </span>
          <span className="flex h-11 flex-1 items-center gap-3">
            <span
              className={`h-full origin-left animate-deck-grow-x rounded-md motion-reduce:animate-none ${bar.highlight ? 'bg-primary' : onDark ? 'bg-on-dark/15' : 'bg-surface-strong'}`}
              style={{ width: `${(bar.value / max) * FULL_PERCENT * 0.78}%`, animationDelay: `${BAR_DELAY_MS + index * BAR_DELAY_MS}ms` } satisfies CSSProperties}
            />
            <span className="animate-deck-fade font-display text-display-md motion-reduce:animate-none" style={{ animationDelay: `${BAR_DELAY_MS * (index + 3)}ms` }}>
              {bar.display}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};
