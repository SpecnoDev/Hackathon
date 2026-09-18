import type { ReactNode } from 'react';
import Link from 'next/link';
import { Icon, type IconName } from './Icon';

type OptionTileSize = 'md' | 'lg';
type OptionTileRole = 'radio' | 'checkbox';

const SIZE: Record<OptionTileSize, string> = {
  md: 'min-h-16 p-5 text-title-md',
  lg: 'min-h-18 p-6 text-title-lg',
};

const SHELL = 'flex w-full items-center gap-4 rounded-lg border text-left text-ink';
const REST = 'border-hairline bg-canvas active:bg-surface-soft';
/** DESIGN.md asks for a 2px primary border when selected; the ring adds the second pixel without shifting layout. */
const SELECTED = 'border-primary bg-primary-tint ring-1 ring-primary';
const UNAVAILABLE = 'border-hairline bg-surface-soft text-muted';

interface OptionTileProps {
  title: string;
  description?: string;
  icon?: IconName;
  lang?: string;
  size?: OptionTileSize;
  selected?: boolean;
  role?: OptionTileRole;
  /** A tile that cannot be chosen yet, with the reason shown in `description`. */
  unavailable?: boolean;
  href?: string;
  trailing?: ReactNode;
  onSelect?: () => void;
}

export const OptionTile = ({
  title,
  description,
  icon,
  lang,
  size = 'md',
  selected = false,
  role = 'radio',
  unavailable = false,
  href,
  trailing,
  onSelect,
}: OptionTileProps) => {
  const className = [SHELL, SIZE[size], unavailable ? UNAVAILABLE : selected ? SELECTED : REST].join(' ');
  const body = (
    <>
      {icon ? <Icon name={icon} className="shrink-0" /> : null}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span lang={lang}>{title}</span>
        {description ? <span className="text-caption text-muted">{description}</span> : null}
      </span>
      {trailing ?? (selected ? <Icon name="check" className="shrink-0 text-primary-text" /> : null)}
      {unavailable && !trailing ? <Icon name="lock" className="shrink-0" /> : null}
    </>
  );

  return href && !unavailable ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      aria-disabled={unavailable}
      disabled={unavailable}
      onClick={onSelect}
      className={className}
    >
      {body}
    </button>
  );
};
