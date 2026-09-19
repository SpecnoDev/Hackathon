'use client';

import { useRef, useState } from 'react';
import { Icon } from './Icon';

const SECONDS_PER_MINUTE = 60;
/** A fixed silhouette: decoding the real waveform would cost a host CPU and battery for no benefit. */
const BAR_HEIGHTS_PERCENT = [30, 55, 80, 45, 95, 60, 35, 70, 100, 50, 75, 40, 85, 55, 30, 65, 90, 45, 70, 35, 60, 80, 40, 55];

export const formatClock = (totalSeconds: number): string => {
  const seconds = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(seconds / SECONDS_PER_MINUTE)}:${String(seconds % SECONDS_PER_MINUTE).padStart(2, '0')}`;
};

interface VoiceNotePlayerProps {
  src: string;
  seconds: number;
  playLabel: string;
  pauseLabel: string;
}

export const VoiceNotePlayer = ({ src, seconds, playLabel, pauseLabel }: VoiceNotePlayerProps) => {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = (): void => {
    const element = audio.current;
    if (!element) return;
    if (playing) element.pause();
    else void element.play().catch(() => setPlaying(false));
  };

  return (
    <div className="flex h-14 items-center gap-3 rounded-md border border-hairline bg-canvas px-4">
      <audio
        ref={audio}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setProgress(0)}
        onTimeUpdate={(event) => setProgress(seconds > 0 ? event.currentTarget.currentTime / seconds : 0)}
      />
      <button
        type="button"
        aria-label={playing ? pauseLabel : playLabel}
        onClick={toggle}
        className="flex size-12 shrink-0 items-center justify-center rounded-sm text-ink"
      >
        <Icon name={playing ? 'pause' : 'play'} />
      </button>
      <div aria-hidden className="flex h-8 flex-1 items-center gap-0.5">
        {BAR_HEIGHTS_PERCENT.map((height, index) => (
          <span
            key={index}
            style={{ height: `${height}%` }}
            className={`flex-1 rounded-full ${index / BAR_HEIGHTS_PERCENT.length < progress ? 'bg-primary' : 'bg-hairline'}`}
          />
        ))}
      </div>
      <span className="shrink-0 text-caption text-ink">{formatClock(seconds)}</span>
    </div>
  );
};
