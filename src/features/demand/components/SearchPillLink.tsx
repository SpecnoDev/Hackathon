import Link from 'next/link';
import { Icon } from '@/shared/components';

/** DESIGN.md search-bar-pill, squared off: a 56px white block. On the green hero the white is edge enough; on the canvas it takes the hairline every other white surface has. */
export const SearchPillLink = ({ href, label, summary, onDark = false }: { href: string; label: string; summary?: string; onDark?: boolean }) => (
  <Link href={href} className={`flex h-14 items-center gap-3 rounded-md bg-canvas px-5 text-ink ${onDark ? '' : 'border border-hairline'}`}>
    <Icon name="search" className="shrink-0" />
    <span className="flex min-w-0 flex-col">
      <span className={`truncate ${summary ? 'text-title-sm text-ink' : 'text-body-md text-muted'}`}>{label}</span>
      {summary ? <span className="truncate text-caption text-muted">{summary}</span> : null}
    </span>
  </Link>
);
