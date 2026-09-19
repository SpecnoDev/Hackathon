import type { ReactNode } from 'react';

/** Linear flows keep the centred 480px column at every width; list screens (Offerings, Bookings, Earnings) widen from tablet up. */
export type HostShellMode = 'linear' | 'list';

const CONTAINER_WIDTH: Record<HostShellMode, string> = {
  linear: 'max-w-host',
  list: 'max-w-host tablet:max-w-[1200px]',
};

interface HostShellProps {
  topBar?: ReactNode;
  progress?: ReactNode;
  /** Offline and other persistent notices, directly under the bar. */
  banner?: ReactNode;
  /** The one primary action: pinned to the bottom on phone, an ordinary inline button from tablet up. */
  footer?: ReactNode;
  nav?: ReactNode;
  /** @default 'linear' */
  mode?: HostShellMode;
  children: ReactNode;
}

/**
 * The host app frame from DESIGN.md: a single column that is never wider than 480px on phone,
 * centred on a soft surface from tablet up, with the primary action pinned above the safe area.
 * List screens widen to a fluid column capped at 1200px from tablet up (see `HostShellMode`).
 */
export const HostShell = ({ topBar, progress, banner, footer, nav, mode = 'linear', children }: HostShellProps) => (
  <div className="min-h-dvh bg-canvas tablet:bg-surface-soft">
    <div className={`mx-auto flex min-h-dvh w-full flex-col bg-canvas ${CONTAINER_WIDTH[mode]}`}>
      <div className="sticky top-0 z-20 bg-canvas">
        {topBar}
        {progress}
        {banner}
      </div>
      <main className="flex flex-1 flex-col px-6 pb-8 pt-6">{children}</main>
      {footer || nav ? (
        <div className="sticky bottom-0 z-10 bg-canvas tablet:static">
          {footer ? (
            <div className="flex flex-col gap-3 border-t border-hairline-soft px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          ) : null}
          {nav ? <div className="tablet:sticky tablet:bottom-0 tablet:z-10">{nav}</div> : null}
        </div>
      ) : null}
    </div>
  </div>
);
