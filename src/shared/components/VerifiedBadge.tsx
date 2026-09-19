import { Icon } from './Icon';

type Density = 'host' | 'traveller';

const BADGE_ICON_PX = 14;

const TEXT: Record<Density, string> = {
  host: 'text-button-sm',
  traveller: 'text-badge',
};

interface VerifiedBadgeProps {
  label: string;
  /** Over a photo the badge lifts off the image. */
  floating?: boolean;
  density?: Density;
}

export const VerifiedBadge = ({ label, floating = false, density = 'host' }: VerifiedBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-xs bg-primary-tint px-2.5 py-1 text-primary-text ${TEXT[density]} ${floating ? 'shadow-lift' : ''}`}
  >
    <Icon name="check" size={BADGE_ICON_PX} />
    {label}
  </span>
);
