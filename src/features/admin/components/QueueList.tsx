import Link from 'next/link';
import { Icon, type StatusTone } from '@/shared/components';
import { STATUS_BAR_TONE } from '../constants';

export interface QueueItem {
  label: string;
  count: number;
  href: string;
  tone: StatusTone;
}

interface QueueListProps {
  title: string;
  note: string;
  clearMessage: string;
  items: readonly QueueItem[];
}

/** Only the rows with work on them; an empty queue is one line, not five zeros. */
export const QueueList = ({ title, note, clearMessage, items }: QueueListProps) => {
  const open = items.filter((item) => item.count > 0);

  return (
    <section className="overflow-hidden rounded-lg border border-hairline bg-canvas">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline px-6 py-4">
        <h2 className="text-title-lg text-ink">{title}</h2>
        {open.length ? <p className="text-caption text-muted">{note}</p> : null}
      </div>
      {open.length === 0 ? (
        <p className="flex items-center gap-3 px-6 py-5 text-body-md text-primary-text">
          <Icon name="circle-check" />
          {clearMessage}
        </p>
      ) : (
        <ul className="divide-y divide-hairline-soft">
          {open.map(({ label, count, href, tone }) => (
            <li key={href}>
              <Link href={href} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-sand motion-reduce:transition-none">
                <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${STATUS_BAR_TONE[tone]}`} />
                <span className="flex-1 text-body-md text-ink">{label}</span>
                <span className="text-title-lg tabular-nums text-ink">{count}</span>
                <Icon name="chevron-right" className="shrink-0 text-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
