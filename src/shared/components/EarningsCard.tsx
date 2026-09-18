'use client';

import { useEffect, useState } from 'react';
import { formatRand } from '@/shared/utils';

/** DESIGN.md: a 300ms count-up the first time the number appears. The one animation on the host side besides the record ring. */
const COUNT_UP_MS = 300;

const useCountUp = (target: number): number => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return undefined;
    }
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number): void => {
      const progress = Math.min(1, (now - startedAt) / COUNT_UP_MS);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
};

interface EarningsCardProps {
  totalLabel: string;
  totalCents: number;
  pendingLabel: string;
  pendingCents: number;
  paidOutLabel: string;
  paidOutCents: number;
}

export const EarningsCard = ({ totalLabel, totalCents, pendingLabel, pendingCents, paidOutLabel, paidOutCents }: EarningsCardProps) => {
  const shown = useCountUp(totalCents);
  return (
    <section className="flex flex-col gap-6 rounded-xl bg-surface-dark p-6 text-on-dark">
      <div className="flex flex-col gap-1">
        <h2 className="text-caption text-on-dark/70">{totalLabel}</h2>
        <p className="font-display text-earnings-display" aria-label={formatRand(totalCents)}>
          {formatRand(shown)}
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <dt className="text-caption text-on-dark/70">{pendingLabel}</dt>
          <dd className="text-title-md">{formatRand(pendingCents)}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-caption text-on-dark/70">{paidOutLabel}</dt>
          <dd className="text-title-md text-accent">{formatRand(paidOutCents)}</dd>
        </div>
      </dl>
    </section>
  );
};
