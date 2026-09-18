import { Icon, type IconName } from './Icon';

const PLACEHOLDER_ICON_PX = 40;

interface PhotoPlateProps {
  /** An object URL for a photo the host just took, or a path under /public. */
  src?: string;
  alt: string;
  placeholderIcon?: IconName;
  /** Turns an empty plate into a nudge, e.g. "Add photos", instead of a dead grey box. */
  placeholderLabel?: string;
  className?: string;
}

/** The 4:3 plate from DESIGN.md. Without a photo it stays honest: a quiet plate, never stock imagery. */
export const PhotoPlate = ({ src, alt, placeholderIcon = 'image', placeholderLabel, className = '' }: PhotoPlateProps) => (
  <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-md bg-surface-soft ${className}`}>
    {src ? (
      // Host photos are object URLs from IndexedDB, which next/image cannot optimise.
      <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
    ) : (
      <div role="img" aria-label={alt} className="flex size-full flex-col items-center justify-center gap-2 text-muted-soft">
        <Icon name={placeholderLabel ? 'camera' : placeholderIcon} size={PLACEHOLDER_ICON_PX} />
        {placeholderLabel ? <span className="text-button-sm text-muted">{placeholderLabel}</span> : null}
      </div>
    )}
  </div>
);
