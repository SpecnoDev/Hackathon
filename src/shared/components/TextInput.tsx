'use client';

import { useId, type HTMLAttributes } from 'react';
import { Icon } from './Icon';

const ERROR_ICON_PX = 16;
const MULTILINE_ROWS = 4;

const FIELD =
  'w-full rounded-md border bg-canvas px-4 text-body-host text-ink placeholder:text-muted-soft focus:outline-none focus:ring-1';
const FIELD_OK = 'border-hairline focus:border-ink focus:ring-ink';
const FIELD_ERROR = 'border-error ring-1 ring-error';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  error?: string;
  placeholder?: string;
  prefix?: string;
  multiline?: boolean;
  type?: 'text' | 'tel';
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  maxLength?: number;
  autoFocus?: boolean;
}

export const TextInput = ({
  label,
  value,
  onChange,
  helper,
  error,
  placeholder,
  prefix,
  multiline = false,
  type = 'text',
  inputMode,
  autoComplete,
  maxLength,
  autoFocus,
}: TextInputProps) => {
  const id = useId();
  const noteId = `${id}-note`;
  const fieldClass = `${FIELD} ${error ? FIELD_ERROR : FIELD_OK}`;
  const shared = {
    id,
    value,
    placeholder,
    maxLength,
    autoFocus,
    'aria-invalid': Boolean(error),
    'aria-describedby': error || helper ? noteId : undefined,
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-caption text-ink">
        {label}
      </label>
      <div className="flex items-stretch gap-2">
        {prefix ? (
          <span className="flex h-14 items-center rounded-md border border-hairline bg-surface-soft px-4 text-body-host text-ink">
            {prefix}
          </span>
        ) : null}
        {multiline ? (
          <textarea
            {...shared}
            rows={MULTILINE_ROWS}
            onChange={(event) => onChange(event.target.value)}
            className={`${fieldClass} py-4`}
          />
        ) : (
          <input
            {...shared}
            type={type}
            inputMode={inputMode}
            autoComplete={autoComplete}
            onChange={(event) => onChange(event.target.value)}
            className={`${fieldClass} h-14`}
          />
        )}
      </div>
      {error ? (
        <p id={noteId} role="alert" className="flex items-start gap-2 text-caption text-error">
          <Icon name="alert" size={ERROR_ICON_PX} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helper ? (
        <p id={noteId} className="text-caption text-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
};
