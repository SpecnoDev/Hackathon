import type { ReactNode } from 'react';

interface HostShellProps {
  /** The persistent web-header (tabs + sign-out): tablet and up only, replacing `nav` there. */
  header?: ReactNode;
  topBar?: ReactNode;
  progress?: ReactNode;
  /** Offline and other persistent notices: directly under the bar on phone, directly under the header from tablet up. */
  banner?: ReactNode;
  /** The one primary action: pinned to the bottom on phone, an ordinary inline button at the end of the content from tablet up. */
  footer?: ReactNode;
  nav?: ReactNode;
  children: ReactNode;
}

/**
 * The host app frame from DESIGN.md: a single column never wider than 480px on phone. From tablet
 * up every screen — linear flow or list alike — fills the same `max-w-page` (1200px) container,
 * left-aligned on `bg-canvas`: no card, no soft-surface backdrop. Only a form control group narrows
 * further, to `max-w-form`, applied where those primitives are composed, not here.
 */
export const HostShell = ({ header, topBar, progress, banner, footer, nav, children }: HostShellProps) => (
  <div className="min-h-dvh bg-sand">
    {header}
    {header ? <div className="hidden tablet:sticky tablet:top-16 tablet:z-20 tablet:block">{banner}</div> : null}
    <div className="mx-auto flex min-h-dvh w-full flex-col bg-sand max-w-host tablet:max-w-page">
      <div className="sticky top-0 z-20 bg-sand tablet:static tablet:bg-transparent">
        {topBar}
        {progress}
        <div className="tablet:hidden">{banner}</div>
      </div>
      <div className="flex flex-1 flex-col">
        <main className="flex flex-1 flex-col px-6 pb-8 pt-6">{children}</main>
        {footer || nav ? (
          <div className="sticky bottom-0 z-10 bg-sand tablet:static tablet:bg-transparent">
            {footer ? (
              <div className="flex flex-col gap-3 border-t border-hairline-soft px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] tablet:flex-row tablet:border-0 tablet:px-6 tablet:pb-0 tablet:pt-6 tablet:[&>*]:w-auto">
                {footer}
              </div>
            ) : null}
            {nav ? <div className="tablet:hidden">{nav}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  </div>
);
