import type { CSSProperties } from 'react';

interface BudgetBar {
  label: string;
  value: number;
  display: string;
  /** The limit the others are judged against. */
  isBudget?: boolean;
}

const FULL_PERCENT = 100;
const BAR_DELAY_MS = 250;

/** Measured sizes against the budget, all to the budget's scale: a short green bar under a long grey one is the whole point. */
export const BudgetBars = ({ bars }: { bars: BudgetBar[] }) => {
  const max = Math.max(...bars.map((bar) => bar.value));
  return (
    <ul className="flex flex-col gap-3">
      {bars.map((bar, index) => (
        <li key={bar.label} className="flex flex-col gap-1">
          <span className="flex items-baseline justify-between gap-3 text-caption">
            <span className="opacity-80">{bar.label}</span>
            <span className="text-title-sm tabular-nums">{bar.display}</span>
          </span>
          <span className="block h-3 overflow-hidden rounded-full bg-on-dark/10">
            <span
              className={`block h-full origin-left animate-deck-grow-x rounded-full motion-reduce:animate-none ${bar.isBudget ? 'bg-on-dark/40' : 'bg-primary'}`}
              style={{ width: `${(bar.value / max) * FULL_PERCENT}%`, animationDelay: `${400 + index * BAR_DELAY_MS}ms` } satisfies CSSProperties}
            />
          </span>
        </li>
      ))}
    </ul>
  );
};
