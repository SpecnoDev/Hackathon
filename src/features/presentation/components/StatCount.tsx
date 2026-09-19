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
  /** `md` is for a stack of three, where the 48px figure would push the last one off the slide. */
  size?: 'lg' | 'md';
}

const FIGURE: Record<'lg' | 'md', string> = { lg: 'text-earnings-display', md: 'text-display-lg' };

/** A figure that counts up when its slide appears. The label carries the meaning; the motion only draws the eye. */
export const StatCount = ({ value, decimals = 0, prefix = '', suffix = '', label, note, delayMs = 0, accent = false, size = 'lg' }: StatCountProps) => {
  const shown = useCountUp(value, delayMs);
  return (
    <div className="flex flex-col gap-1">
      <p className={`font-display ${FIGURE[size]} ${accent ? 'text-accent' : ''}`}>
        {prefix}
        {shown.toFixed(decimals)}
        {suffix}
      </p>
      <p className="text-title-sm">{label}</p>
      {note ? <p className="text-body-sm opacity-70">{note}</p> : null}
    </div>
  );
};
