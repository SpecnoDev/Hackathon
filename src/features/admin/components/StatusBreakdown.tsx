import Link from 'next/link';
import type { StatusTone } from '@/shared/components';
import { STATUS_BAR_TONE } from '../constants';

const PERCENT = 100;

export interface StatusSegment {
  key: string;
  label: string;
  count: number;
  tone: StatusTone;
  href: string;
}

interface StatusBreakdownProps {
  title: string;
  headline: number;
  headlineLabel: string;
  totalLabel: string;
  none: string;
  segments: readonly StatusSegment[];
}

/** One number that matters, then how the rest splits: a bar for the shape, a legend with the words and the links. */
export const StatusBreakdown = ({ title, headline, headlineLabel, totalLabel, none, segments }: StatusBreakdownProps) => {
  const total = segments.reduce((sum, segment) => sum + segment.count, 0);
  const shown = segments.filter((segment) => segment.count > 0);

  return (
    <div className="flex flex-col gap-4 bg-canvas p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-title-sm text-ink">{title}</h3>
        <span className="text-caption text-muted">{totalLabel}</span>
      </div>
      <p className="flex items-baseline gap-2">
        <span className="font-display text-display-lg tabular-nums text-ink">{headline}</span>
        <span className="text-body-sm text-muted">{headlineLabel}</span>
      </p>
      <div aria-hidden className="flex h-2 overflow-hidden rounded-xs bg-surface-soft">
        {shown.map(({ key, count, tone }) => (
          <span key={key} className={STATUS_BAR_TONE[tone]} style={{ width: `${(count / total) * PERCENT}%` }} />
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="text-body-sm text-muted">{none}</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {shown.map(({ key, label, count, tone, href }) => (
            <li key={key}>
              <Link href={href} className="flex items-center gap-2 text-body-sm text-ink hover:text-primary-text">
                <span aria-hidden className={`size-2 shrink-0 rounded-full ${STATUS_BAR_TONE[tone]}`} />
                <span className="flex-1">{label}</span>
                <span className="tabular-nums text-muted">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
