import type { CSSProperties } from 'react';

const POP_DELAY_MS = 45;
const HOLD_BEFORE_HIGHLIGHT_MS = 400;

/** "5 of every 100" as twenty squares, one of them lit. The squares land first, then the one that stays lights up. */
export const ShareGrid = ({ total, lit, label }: { total: number; lit: number; label: string }) => (
  <div role="img" aria-label={label} className="grid w-full max-w-sm grid-cols-10 gap-2">
    {Array.from({ length: total }, (_, index) => {
      const isLit = index < lit;
      return (
        <span
          key={index}
          className={`aspect-square animate-deck-pop rounded-sm motion-reduce:animate-none ${isLit ? 'bg-accent' : 'bg-on-dark/10'}`}
          style={{ animationDelay: `${isLit ? total * POP_DELAY_MS + HOLD_BEFORE_HIGHLIGHT_MS : index * POP_DELAY_MS}ms` } satisfies CSSProperties}
        />
      );
    })}
  </div>
);
