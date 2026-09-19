'use client';

import { useId, useState } from 'react';
import { CENTS_PER_RAND } from '@/core/constants';
import { formatRand, hostReceivesCents, platformFeeCents } from '@/shared/utils';
import { DECK_COPY } from '../constants';

const copy = DECK_COPY.payout;
const MIN_RAND = 100;
const MAX_RAND = 2000;
const STEP_RAND = 50;
const FULL_PERCENT = 100;

/**
 * The PRD's promise, made touchable: whatever the price, the host sees what they will receive before they publish.
 * The split uses the same fee helpers as the host app, so the deck can never disagree with the product.
 */
export const FeeSplit = ({ startCents }: { startCents: number }) => {
  const sliderId = useId();
  const [priceCents, setPriceCents] = useState(startCents);
  const receives = hostReceivesCents(priceCents);
  const fee = platformFeeCents(priceCents);
  const hostShare = (receives / priceCents) * FULL_PERCENT;

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface-soft p-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-body-sm text-muted">{copy.split.booking}</p>
        <p className="font-display text-display-md text-ink">{formatRand(priceCents)}</p>
      </div>
      <div className="flex h-11 origin-left animate-deck-grow-x overflow-hidden rounded-md motion-reduce:animate-none" style={{ animationDelay: '500ms' }}>
        <span className="flex items-center bg-primary px-3 text-title-sm text-on-primary transition-[width] duration-200" style={{ width: `${hostShare}%` }}>
          {formatRand(receives)}
        </span>
        <span className="flex flex-1 items-center justify-end bg-surface-strong px-3 text-caption text-ink">{formatRand(fee)}</span>
      </div>
      <div className="flex justify-between text-caption text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-2.5 rounded-full bg-accent" />
          {copy.split.host}
        </span>
        <span>{copy.split.fee}</span>
      </div>
      <label htmlFor={sliderId} className="text-caption text-muted">
        {copy.tryIt}
      </label>
      <input
        id={sliderId}
        type="range"
        min={MIN_RAND}
        max={MAX_RAND}
        step={STEP_RAND}
        value={priceCents / CENTS_PER_RAND}
        onChange={(event) => setPriceCents(Number(event.target.value) * CENTS_PER_RAND)}
        aria-label={copy.priceLabel}
        className="h-10 w-full accent-primary"
      />
    </div>
  );
};
