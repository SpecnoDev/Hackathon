import type { ReactNode } from 'react';

interface HostShellProps {
  topBar?: ReactNode;
  progress?: ReactNode;
  /** Offline and other persistent notices, directly under the bar. */
  banner?: ReactNode;
  /** The one primary action, pinned to the bottom. */
  footer?: ReactNode;
  nav?: ReactNode;
  children: ReactNode;
}

/**
 * The host app frame from DESIGN.md: a single column that is never wider than 480px,
 * centred on a soft surface from tablet up, with the primary action pinned above the safe area.
 */
export const HostShell = ({ topBar, progress, banner, footer, nav, children }: HostShellProps) => (
  <div className="min-h-dvh bg-canvas tablet:bg-surface-soft">
    <div className="mx-auto flex min-h-dvh w-full max-w-host flex-col bg-canvas">
      <div className="sticky top-0 z-20 bg-canvas">
        {topBar}
        {progress}
        {banner}
      </div>
      <main className="flex flex-1 flex-col px-6 pb-8 pt-6">{children}</main>
      {footer || nav ? (
        <div className="sticky bottom-0 z-10 bg-canvas">
          {footer ? (
            <div className="flex flex-col gap-3 border-t border-hairline-soft px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          ) : null}
          {nav}
        </div>
      ) : null}
    </div>
  </div>
);
