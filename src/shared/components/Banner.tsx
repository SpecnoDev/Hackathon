import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

type BannerTone = 'success' | 'error' | 'warning' | 'info';

const TONE: Record<BannerTone, { shell: string; icon: IconName; iconColor: string }> = {
  success: { shell: 'bg-primary-tint text-ink', icon: 'check', iconColor: 'text-primary-text' },
  error: { shell: 'bg-error-tint text-error', icon: 'alert', iconColor: 'text-error' },
  warning: { shell: 'bg-accent-tint text-ink', icon: 'info', iconColor: 'text-ink' },
  info: { shell: 'bg-surface-soft text-ink', icon: 'info', iconColor: 'text-muted' },
};

interface BannerProps {
  tone: BannerTone;
  icon?: IconName;
  children: ReactNode;
}

/** Every banner pairs its tint with a glyph and a sentence, so the state never rests on colour. */
export const Banner = ({ tone, icon, children }: BannerProps) => (
  <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-3 rounded-md p-4 text-body-md ${TONE[tone].shell}`}>
    <Icon name={icon ?? TONE[tone].icon} className={`mt-0.5 shrink-0 ${TONE[tone].iconColor}`} />
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);
