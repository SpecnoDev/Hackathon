'use client';

import { useEffect, useState } from 'react';
import { COUNT_UP_MS } from '../constants';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const easeOut = (progress: number): number => 1 - (1 - progress) ** 3;

/** Counts from zero to the target once, when the slide appears. With reduced motion it simply shows the number. */
export const useCountUp = (target: number, delayMs = 0): number => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION).matches) {
      setValue(target);
      return undefined;
    }
    let frame = 0;
    let start: number | undefined;
    const tick = (now: number): void => {
      start ??= now + delayMs;
      const progress = Math.min(Math.max((now - start) / COUNT_UP_MS, 0), 1);
      setValue(target * easeOut(progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, delayMs]);

  return value;
};
