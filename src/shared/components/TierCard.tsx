import type { ReactNode } from 'react';

interface TierCardProps {
  name: string;
  unlocks: string;
  badge?: ReactNode;
  /** Shown on the tier the host holds now, e.g. "You are here". */
  currentLabel?: string;
}

export const TierCard = ({ name, unlocks, badge, currentLabel }: TierCardProps) => (
  <div
    className={`flex flex-col gap-2 rounded-lg border p-5 ${currentLabel ? 'border-primary bg-primary-tint ring-1 ring-primary' : 'border-hairline bg-canvas'}`}
  >
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-title-md text-ink">{name}</h2>
      {currentLabel ? <span className="text-caption text-primary-text">{currentLabel}</span> : null}
    </div>
    <p className="text-body-host text-ink">{unlocks}</p>
    {badge ? <div>{badge}</div> : null}
  </div>
);
