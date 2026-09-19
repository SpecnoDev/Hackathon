'use client';

import { useState } from 'react';
import { Icon } from '@/shared/components';
import { formatRand } from '@/shared/utils';
import { DECK_COPY } from '../constants';

const copy = DECK_COPY.group;
const FULL_PERCENT = 100;

interface PotMeterProps {
  totalCents: number;
  shareCents: number;
  friends: readonly string[];
  paidAtStart: number;
}

/** The stokvel-style pot. It opens three-quarters full, and the presenter pays the last share to confirm the trip on stage. */
export const PotMeter = ({ totalCents, shareCents, friends, paidAtStart }: PotMeterProps) => {
  const [paid, setPaid] = useState(paidAtStart);
  const full = paid >= friends.length;
  const paidCents = Math.min(paid * shareCents, totalCents);

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-surface-soft p-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-title-sm text-ink">{copy.potTitle}</p>
        <p className="font-display text-display-md text-ink">{copy.potOf(formatRand(paidCents), formatRand(totalCents))}</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-surface-strong">
        <div
          className="h-full origin-left animate-deck-grow-x rounded-full bg-primary transition-[width] duration-500 motion-reduce:animate-none"
          style={{ width: `${(paidCents / totalCents) * FULL_PERCENT}%`, animationDelay: '500ms' }}
        />
      </div>
      <ul className="grid grid-cols-2 gap-2">
        {friends.map((friend, index) => {
          const hasPaid = index < paid;
          return (
            <li key={friend} className={`flex items-center gap-2 rounded-md px-3 py-2 text-caption ${hasPaid ? 'bg-primary-tint text-primary-text' : 'bg-canvas text-muted'}`}>
              <Icon name={hasPaid ? 'check' : 'clock'} size={16} />
              <span className="flex-1 text-ink">{friend}</span>
              <span>{hasPaid ? copy.paid : copy.waiting}</span>
            </li>
          );
        })}
      </ul>
      {full ? (
        <div className="flex items-center justify-between gap-3">
          <p className="flex animate-deck-pop items-center gap-2 text-title-sm text-primary-text motion-reduce:animate-none">
            <Icon name="calendar-check" size={20} />
            {copy.confirmed}
          </p>
          <button type="button" onClick={() => setPaid(paidAtStart)} className="min-h-12 px-2 text-link text-primary-text underline">
            {copy.reset}
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setPaid((count) => count + 1)} className="flex h-12 items-center justify-center gap-2 rounded-md bg-primary text-button-md text-on-primary active:bg-primary-active">
          <Icon name="banknote" size={20} />
          {copy.pay(friends[paid])} {formatRand(shareCents)}
        </button>
      )}
      <p className="text-caption text-muted" aria-live="polite">
        {copy.paidCount(Math.min(paid, friends.length), friends.length)}
      </p>
    </div>
  );
};
