import { Icon, type IconName } from './Icon';

interface ToggleRowProps {
  label: string;
  icon?: IconName;
  checked: boolean;
  /** The words "On" and "Off", so the state never rests on the colour of the track. */
  onLabel: string;
  offLabel: string;
  onChange: (checked: boolean) => void;
}

export const ToggleRow = ({ label, icon, checked, onLabel, offLabel, onChange }: ToggleRowProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="flex min-h-16 w-full items-center gap-4 rounded-lg border border-hairline bg-canvas p-5 text-left"
  >
    {icon ? <Icon name={icon} className="shrink-0 text-ink" /> : null}
    <span className="flex-1 text-title-md text-ink">{label}</span>
    <span className="text-caption text-ink">{checked ? onLabel : offLabel}</span>
    <span aria-hidden className={`flex h-8 w-14 shrink-0 items-center rounded-full p-1 ${checked ? 'justify-end bg-primary' : 'justify-start bg-border-strong'}`}>
      <span className="size-6 rounded-full bg-canvas" />
    </span>
  </button>
);
