import Link from 'next/link';
import { relativeTime } from '@/shared/utils';
import { ADMIN_TIMESTAMP } from '../constants';
import type { AuditEntry } from '../services';

interface RecentChangesProps {
  title: string;
  allLabel: string;
  allHref: string;
  empty: string;
  entries: readonly AuditEntry[];
}

/** The last few lines of the trail, so the overview also says what people have been doing. */
export const RecentChanges = ({ title, allLabel, allHref, empty, entries }: RecentChangesProps) => (
  <section className="overflow-hidden rounded-lg border border-hairline bg-canvas">
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline px-6 py-4">
      <h2 className="text-title-lg text-ink">{title}</h2>
      <Link href={allHref} className="text-link text-primary-text underline">
        {allLabel}
      </Link>
    </div>
    {entries.length === 0 ? (
      <p className="px-6 py-5 text-body-md text-muted">{empty}</p>
    ) : (
      <ol className="divide-y divide-hairline-soft">
        {entries.map(({ id, at, sentence, reason }) => (
          <li key={id} className="flex flex-col gap-1 px-6 py-4 tablet:flex-row tablet:items-baseline tablet:gap-6">
            <time dateTime={at.toISOString()} title={ADMIN_TIMESTAMP.format(at)} className="shrink-0 text-caption text-muted tablet:w-28">
              {relativeTime(at)}
            </time>
            <div className="min-w-0 flex-1">
              <p className="text-body-md text-ink">{sentence}</p>
              {reason ? <p className="text-body-sm text-muted">{reason}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    )}
  </section>
);
