import type { ReactNode } from 'react';

interface ListSurfaceProps {
  /** Filters, on the left of the toolbar. */
  toolbar?: ReactNode;
  /** The count or a status, on the right of the toolbar. */
  meta?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * One white surface per list: the filters and the count in its toolbar, the rows inside, the pager
 * in its footer. DESIGN.md's warm paper with a hairline, never a floating card per part.
 */
export const ListSurface = ({ toolbar, meta, footer, children }: ListSurfaceProps) => (
  <section className="overflow-hidden rounded-lg border border-hairline bg-canvas">
    {toolbar || meta ? (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-4 py-3">
        {toolbar ?? <span />}
        {meta ? <p className="text-caption text-muted">{meta}</p> : null}
      </div>
    ) : null}
    {children}
    {footer ? <div className="border-t border-hairline px-4 py-3">{footer}</div> : null}
  </section>
);
