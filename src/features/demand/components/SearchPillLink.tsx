import Link from 'next/link';
import { Icon } from '@/shared/components';
import { TRAVELLER_ROUTES } from '../constants';

/** DESIGN.md search-bar-pill: a 56px white pill with the lift shadow. Tapping it opens the full-screen search. */
export const SearchPillLink = ({ label, summary }: { label: string; summary?: string }) => (
  <Link href={TRAVELLER_ROUTES.search} className="flex h-14 items-center gap-3 rounded-full border border-hairline bg-canvas px-5 text-ink shadow-lift">
    <Icon name="search" className="shrink-0" />
    <span className="flex min-w-0 flex-col">
      <span className={`truncate ${summary ? 'text-title-sm text-ink' : 'text-body-md text-muted'}`}>{label}</span>
      {summary ? <span className="truncate text-caption text-muted">{summary}</span> : null}
    </span>
  </Link>
);
