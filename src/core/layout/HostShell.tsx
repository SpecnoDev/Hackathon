import type { ReactNode } from 'react';
import { HostBottomNav } from './HostBottomNav';

/**
 * Host chrome: one centred 480px column, 18px body text and 24px gutters (DESIGN.md
 * "Two Densities"), with the bottom nav in flow so no screen has to reserve space for it.
 * The header carries who you are signed in as, because each screen titles itself.
 */
export function HostShell({ hostName, children }: { hostName: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface-soft">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-canvas text-body-host text-ink">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center border-b border-hairline bg-canvas px-6">
          <span className="truncate text-title-md">{hostName}</span>
        </header>

        <main className="flex flex-1 flex-col gap-6 px-6 py-6">{children}</main>

        <HostBottomNav />
      </div>
    </div>
  );
}
