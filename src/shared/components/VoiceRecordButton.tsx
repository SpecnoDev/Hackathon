'use client';

import type { KeyboardEvent, PointerEvent } from 'react';
import { Icon } from './Icon';

type VoiceButtonSize = 'lg' | 'md';

const SIZE: Record<VoiceButtonSize, { shell: string; iconPx: number }> = {
  lg: { shell: 'size-24', iconPx: 40 },
  md: { shell: 'size-16', iconPx: 28 },
};

interface VoiceRecordButtonProps {
  recording: boolean;
  label: string;
  onStart: () => void;
  onStop: () => void;
  size?: VoiceButtonSize;
  disabled?: boolean;
}

/**
 * Hold to record, release to stop. Space or Enter toggles instead, because a held key
 * is not something a keyboard or switch user can be asked to do.
 */
export const VoiceRecordButton = ({ recording, label, onStart, onStop, size = 'lg', disabled = false }: VoiceRecordButtonProps) => {
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>): void => {
    onStart();
    // Capture keeps the release coming to this button if the thumb slides off it. Recording must not depend on it.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* some browsers refuse capture for pointers they did not originate */
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if ((event.key !== ' ' && event.key !== 'Enter') || event.repeat) return;
    event.preventDefault();
    if (recording) onStop();
    else onStart();
  };

  return (
    <span className={`relative inline-flex ${SIZE[size].shell}`}>
      {recording ? (
        <span aria-hidden className="absolute inset-0 rounded-full border-4 border-accent animate-record-ring motion-reduce:hidden" />
      ) : null}
      <button
        type="button"
        aria-label={label}
        aria-pressed={recording}
        disabled={disabled}
        onPointerDown={handlePointerDown}
        onPointerUp={onStop}
        onPointerCancel={onStop}
        onKeyDown={handleKeyDown}
        onContextMenu={(event) => event.preventDefault()}
        className={`relative flex size-full touch-none select-none items-center justify-center rounded-full disabled:bg-primary-disabled ${recording ? 'bg-accent text-on-accent' : 'bg-primary text-on-primary'}`}
      >
        <Icon name={recording ? 'waveform' : 'mic'} size={SIZE[size].iconPx} />
      </button>
    </span>
  );
};
