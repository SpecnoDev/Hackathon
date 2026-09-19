'use client';

import type { ReactNode } from 'react';
import { useCountUp } from '../hooks';

interface StatCountProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note?: ReactNode;
  delayMs?: number;
  /** Orange marks the figure the slide is really about. One per slide. */
  accent?: boolean;
}

/** A figure that counts up when its slide appears. The label carries the meaning; the motion only draws the eye. */
export const StatCount = ({ value, decimals = 0, prefix = '', suffix = '', label, note, delayMs = 0, accent = false }: StatCountProps) => {
  const shown = useCountUp(value, delayMs);
  return (
    <div className="flex flex-col gap-1">
      <p className={`font-display text-earnings-display ${accent ? 'text-accent' : ''}`}>
        {prefix}
        {shown.toFixed(decimals)}
        {suffix}
      </p>
      <p className="text-title-sm">{label}</p>
      {note ? <p className="text-body-sm opacity-70">{note}</p> : null}
    </div>
  );
};
