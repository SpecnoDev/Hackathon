import Link from 'next/link';
import { Icon } from '@/shared/components';

const CHIP_ICON_PX = 16;
const CHIP = 'inline-flex min-h-10 items-center gap-1.5 rounded-sm px-3 text-button-sm transition-colors motion-reduce:transition-none';
const CHIP_ON = 'bg-ink text-canvas';
const CHIP_OFF = 'bg-surface-soft text-ink hover:bg-surface-strong';

export interface FilterChip {
  href: string;
  label: string;
  selected: boolean;
}

/** Links, not a control: a filtered list is a URL an operator can keep or send to someone else. */
export const FilterChips = ({ label, chips }: { label: string; chips: readonly FilterChip[] }) => (
  <nav aria-label={label} className="flex flex-wrap gap-1.5">
    {chips.map(({ href, label: text, selected }) => (
      <Link key={href} href={href} aria-current={selected ? 'page' : undefined} className={`${CHIP} ${selected ? CHIP_ON : CHIP_OFF}`}>
        {selected ? <Icon name="check" size={CHIP_ICON_PX} /> : null}
        {text}
      </Link>
    ))}
  </nav>
);
