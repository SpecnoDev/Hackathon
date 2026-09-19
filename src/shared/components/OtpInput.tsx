'use client';

import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';

const NON_DIGITS = /\D/g;
const BOX = 'size-16 rounded-md border bg-canvas text-center font-display text-display-md text-ink focus:outline-none focus:ring-1';
const BOX_OK = 'border-hairline focus:border-ink focus:ring-ink';
const BOX_ERROR = 'border-error ring-1 ring-error';

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete: (value: string) => void;
  /** Read out for each box, e.g. "Number 2 of 4". */
  digitLabel: (position: number) => string;
  invalid?: boolean;
}

export const OtpInput = ({ length, value, onChange, onComplete, digitLabel, invalid = false }: OtpInputProps) => {
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  const commit = (next: string): void => {
    const digits = next.replace(NON_DIGITS, '').slice(0, length);
    onChange(digits);
    boxes.current[Math.min(digits.length, length - 1)]?.focus();
    if (digits.length === length) onComplete(digits);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (event.key !== 'Backspace') return;
    event.preventDefault();
    commit(value.slice(0, value[index] ? index : Math.max(0, index - 1)));
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>): void => {
    event.preventDefault();
    commit(event.clipboardData.getData('text'));
  };

  return (
    <div className="flex w-full justify-center gap-3 tablet:max-w-form tablet:justify-start">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            boxes.current[index] = element;
          }}
          value={value[index] ?? ''}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          aria-label={digitLabel(index + 1)}
          aria-invalid={invalid}
          autoFocus={index === 0}
          onChange={(event) => commit(value.slice(0, index) + event.target.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={handlePaste}
          className={`${BOX} ${invalid ? BOX_ERROR : BOX_OK}`}
        />
      ))}
    </div>
  );
};
