'use client';

import { useEffect, useState } from 'react';
import { STAGE_HEIGHT, STAGE_WIDTH } from '../constants';

/** How much to scale the fixed-size stage so it fills the window without cropping, like a projector would. */
export const useStageScale = (reservedHeight: number): number => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = (): void => setScale(Math.min(window.innerWidth / STAGE_WIDTH, (window.innerHeight - reservedHeight) / STAGE_HEIGHT));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [reservedHeight]);

  return scale;
};
