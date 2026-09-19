'use client';

import type { ReactNode } from 'react';
import { Icon } from '@/shared/components';
import { DECK_COPY, STAGE_HEIGHT, STAGE_WIDTH } from '../constants';
import { useStageScale } from '../hooks';

const copy = DECK_COPY.chrome;
const CHROME_HEIGHT_PX = 56;

interface DeckStageProps {
  index: number;
  total: number;
  onNext: () => void;
  onPrevious: () => void;
  onGoTo: (index: number) => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  children: ReactNode;
}

const RoundButton = ({ label, onClick, disabled = false, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) => (
  <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className="flex size-12 items-center justify-center rounded-full text-on-dark active:bg-on-dark/10 disabled:text-on-dark/30">
    {children}
  </button>
);

/**
 * The room the slides sit in: a fixed-size stage scaled to the window, so every slide composes the same on a laptop
 * and a projector, with the progress and the controls in a bar underneath rather than over the content.
 */
export const DeckStage = ({ index, total, onNext, onPrevious, onGoTo, isFullScreen, onToggleFullScreen, children }: DeckStageProps) => {
  const scale = useStageScale(CHROME_HEIGHT_PX);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ink">
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div className="overflow-hidden rounded-sm shadow-lift" style={{ width: STAGE_WIDTH * scale, height: STAGE_HEIGHT * scale }}>
          <div className="origin-top-left" style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${scale})` }}>
            {children}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 px-3" style={{ height: CHROME_HEIGHT_PX }}>
        <RoundButton label={copy.previous} onClick={onPrevious} disabled={index === 0}>
          <Icon name="chevron-left" />
        </RoundButton>
        <ol className="flex flex-1 items-center gap-1.5" aria-label={copy.counter(index + 1, total)}>
          {Array.from({ length: total }, (_, slide) => (
            <li key={slide} className="flex-1">
              <button type="button" aria-label={copy.counter(slide + 1, total)} aria-current={slide === index ? 'step' : undefined} onClick={() => onGoTo(slide)} className="flex h-12 w-full items-center">
                <span className={`block h-1 w-full rounded-full transition-colors duration-300 ${slide <= index ? 'bg-primary' : 'bg-on-dark/20'}`} />
              </button>
            </li>
          ))}
        </ol>
        <p className="w-14 text-center text-caption text-on-dark/70 tabular-nums">{copy.counter(index + 1, total)}</p>
        <RoundButton label={copy.next} onClick={onNext} disabled={index === total - 1}>
          <Icon name="chevron-right" />
        </RoundButton>
        <button type="button" onClick={onToggleFullScreen} className="hidden h-12 items-center px-3 text-caption text-on-dark/70 underline tablet:flex">
          {isFullScreen ? copy.exitFullScreen : copy.fullScreen}
        </button>
      </div>
    </div>
  );
};
