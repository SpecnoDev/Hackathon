import Link from 'next/link';
import { FIRST_PAGE, PAGE_PARAM, PAGE_SIZES, PAGE_SIZE_PARAM, type PageSize } from '@/core/constants';
import { Icon } from './Icon';

const COPY = {
  summary: (from: number, to: number, total: number) => `Showing ${from}–${to} of ${total}`,
  none: 'Nothing to show',
  previous: 'Previous',
  next: 'Next',
  rowsPerPage: 'Rows per page',
  navLabel: 'Pages',
} as const;

const STEP_ICON_PX = 16;
const STEP = 'inline-flex h-12 items-center gap-1 rounded-md border px-4 text-button-md';
const STEP_LIVE = `${STEP} border-ink bg-canvas text-ink hover:bg-surface-soft`;
const STEP_OFF = `${STEP} border-border-strong bg-canvas text-muted-soft`;
const SIZE_CHIP = 'inline-flex h-10 min-w-10 items-center justify-center rounded-sm px-3 text-button-sm';

interface PaginationProps {
  total: number;
  page: number;
  size: PageSize;
  basePath: string;
  /** Query params the list is already filtered by, carried through every link so a page change keeps the filter. */
  query?: Record<string, string | undefined>;
}

const href = (basePath: string, query: Record<string, string | undefined>, page: number, size: PageSize): string => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => value && params.set(key, value));
  params.set(PAGE_PARAM, String(page));
  params.set(PAGE_SIZE_PARAM, String(size));

  return `${basePath}?${params}`;
};

/**
 * Links, not buttons: a page is a URL an operator can keep or send to someone. Disabled steps stay
 * on screen as words, so the edge of the list reads without colour.
 */
export const Pagination = ({ total, page, size, basePath, query = {} }: PaginationProps) => {
  const lastPage = Math.max(FIRST_PAGE, Math.ceil(total / size));
  const from = total === 0 ? 0 : (page - FIRST_PAGE) * size + 1;
  const to = Math.min(page * size, total);
  const hasPrevious = page > FIRST_PAGE;
  const hasNext = page < lastPage;

  return (
    <nav aria-label={COPY.navLabel} className="flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
      <p className="text-body-sm text-muted">{total === 0 ? COPY.none : COPY.summary(from, to, total)}</p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-caption text-muted">{COPY.rowsPerPage}</span>
          {PAGE_SIZES.map((option) => {
            const selected = option === size;

            return (
              <Link
                key={option}
                href={href(basePath, query, FIRST_PAGE, option)}
                aria-current={selected ? 'true' : undefined}
                className={`${SIZE_CHIP} ${selected ? 'bg-ink text-canvas' : 'bg-surface-soft text-ink hover:bg-surface-strong'}`}
              >
                {option}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {hasPrevious ? (
            <Link href={href(basePath, query, page - 1, size)} rel="prev" className={STEP_LIVE}>
              <Icon name="chevron-left" size={STEP_ICON_PX} />
              {COPY.previous}
            </Link>
          ) : (
            <span aria-disabled="true" className={STEP_OFF}>
              <Icon name="chevron-left" size={STEP_ICON_PX} />
              {COPY.previous}
            </span>
          )}
          {hasNext ? (
            <Link href={href(basePath, query, page + 1, size)} rel="next" className={STEP_LIVE}>
              {COPY.next}
              <Icon name="chevron-right" size={STEP_ICON_PX} />
            </Link>
          ) : (
            <span aria-disabled="true" className={STEP_OFF}>
              {COPY.next}
              <Icon name="chevron-right" size={STEP_ICON_PX} />
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};
