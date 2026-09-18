import { Icon, type IconName } from './Icon';

export type StatusTone = 'draft' | 'review' | 'live' | 'paused' | 'rejected';
type Density = 'host' | 'traveller';

const PILL_ICON_PX = 14;

/** The five treatments DESIGN.md defines. Each has its own glyph so the state reads without colour. */
const TONE: Record<StatusTone, { shell: string; icon: IconName }> = {
  draft: { shell: 'bg-surface-strong text-muted', icon: 'dot' },
  review: { shell: 'bg-accent-tint text-ink', icon: 'clock' },
  live: { shell: 'bg-primary-tint text-primary-text', icon: 'check' },
  paused: { shell: 'bg-surface-strong text-ink', icon: 'pause' },
  rejected: { shell: 'bg-error-tint text-error', icon: 'x' },
};

/** Host screens never go below 14px, so the 12px badge style is kept for the traveller density only. */
const TEXT: Record<Density, string> = {
  host: 'text-button-sm',
  traveller: 'text-badge',
};

interface StatusPillProps {
  tone: StatusTone;
  label: string;
  icon?: IconName;
  density?: Density;
}

export const StatusPill = ({ tone, label, icon, density = 'host' }: StatusPillProps) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${TEXT[density]} ${TONE[tone].shell}`}>
    <Icon name={icon ?? TONE[tone].icon} size={PILL_ICON_PX} />
    {label}
  </span>
);
