import type { ReactNode } from 'react';

type ShellWidth = 'page' | 'column';

const WIDTH: Record<ShellWidth, string> = {
  page: 'max-w-page',
  column: 'max-w-host',
};

interface TravellerShellProps {
  topBar?: ReactNode;
  /** Edge-to-edge content above the padded column, e.g. the dark hero or a photo carousel. */
  lead?: ReactNode;
  /** The one action for this screen, pinned above the nav where the host app pins its own. */
  footer?: ReactNode;
  nav?: ReactNode;
  /** `page` is the 1200px browsing width; `column` is the 480px reading column for forms and receipts. */
  width?: ShellWidth;
  children: ReactNode;
}

/**
 * The traveller frame from DESIGN.md: the host frame's bars and pinned action, with content capped at 1200px
 * so card grids can widen on a tablet and a desktop. Same parts as HostShell, never a different design.
 */
export const TravellerShell = ({ topBar, lead, footer, nav, width = 'page', children }: TravellerShellProps) => (
  <div className="flex min-h-dvh flex-col bg-sand">
    {topBar ? <div className="sticky top-0 z-20 bg-sand">{topBar}</div> : null}
    {lead}
    <main className={`mx-auto flex w-full flex-1 flex-col px-4 pb-10 pt-6 tablet:px-6 ${WIDTH[width]}`}>{children}</main>
    {footer || nav ? (
      <div className="sticky bottom-0 z-10 bg-sand">
        {footer ? (
          <div className="border-t border-hairline-soft">
            <div className={`mx-auto flex w-full flex-col gap-3 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] tablet:px-6 ${WIDTH[width]}`}>{footer}</div>
          </div>
        ) : null}
        {nav}
      </div>
    ) : null}
  </div>
);
