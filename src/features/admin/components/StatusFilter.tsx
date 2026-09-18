import Link from 'next/link';
import { Icon } from '@/shared/components';
import { ADMIN_COPY } from '../constants';
import { statusHref } from '../utils';

const FILTER_ICON_PX = 16;
const CHIP = 'inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-button-sm';

export interface StatusFilterOption {
  value: string;
  label: string;
}

interface StatusFilterProps {
  basePath: string;
  options: readonly StatusFilterOption[];
  active: string;
}

/** Links, not a control: a filtered list is a URL an operator can keep or send to someone else. */
export const StatusFilter = ({ basePath, options, active }: StatusFilterProps) => (
  <nav aria-label={ADMIN_COPY.filterLabel} className="flex flex-wrap gap-2">
    {options.map(({ value, label }) => {
      const selected = value === active;

      return (
        <Link
          key={value}
          href={statusHref(basePath, value)}
          aria-current={selected ? 'page' : undefined}
          className={`${CHIP} ${selected ? 'bg-ink text-on-dark' : 'bg-surface-soft text-ink'}`}
        >
          {selected ? <Icon name="check" size={FILTER_ICON_PX} /> : null}
          {label}
        </Link>
      );
    })}
  </nav>
);
