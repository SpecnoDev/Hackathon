import { Icon } from './Icon';

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  decreaseLabel: string;
  increaseLabel: string;
  onChange: (value: number) => void;
}

/** A number a host can set with two big buttons, so nothing has to be typed. */
export const Stepper = ({ label, value, min, max, decreaseLabel, increaseLabel, onChange }: StepperProps) => (
  <div className="flex items-center justify-between gap-4 rounded-lg border border-hairline bg-canvas p-4">
    <p className="text-title-md text-ink">{label}</p>
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label={decreaseLabel}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className="flex size-12 items-center justify-center rounded-full border border-ink text-ink disabled:border-border-strong disabled:text-muted-soft"
      >
        <Icon name="minus" />
      </button>
      <output aria-live="polite" className="w-10 text-center font-display text-display-md text-ink">
        {value}
      </output>
      <button
        type="button"
        aria-label={increaseLabel}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="flex size-12 items-center justify-center rounded-full border border-ink text-ink disabled:border-border-strong disabled:text-muted-soft"
      >
        <Icon name="plus" />
      </button>
    </div>
  </div>
);
