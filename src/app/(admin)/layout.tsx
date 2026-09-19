import { cookies } from 'next/headers';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { APP_NAME, DEMO_MODE_COOKIE, DEMO_MODE_ON, ROUTES } from '@/core/constants';
import { requireAdminPage } from '@/core/guards';
import { AdminNav, DemoModeToggle } from '@/features/admin/components';
import { ADMIN_SHELL_COPY } from '@/features/admin/constants';
import { HostedLogo } from '@/shared/components';

export const metadata = { title: ADMIN_SHELL_COPY.title };

/** A sidebar from the desktop breakpoint, a bar above the content below it. The page floor is the sand, every surface on it the paper. */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const [{ email }, jar] = await Promise.all([requireAdminPage(), cookies()]);
  const demoMode = jar.get(DEMO_MODE_COOKIE)?.value === DEMO_MODE_ON;

  return (
    <div className="flex min-h-dvh flex-col bg-sand desktop:flex-row">
      <aside className="flex flex-col gap-4 border-b border-hairline bg-canvas px-4 py-3 desktop:sticky desktop:top-0 desktop:h-dvh desktop:w-64 desktop:shrink-0 desktop:border-b-0 desktop:border-r desktop:py-6">
        <div className="flex items-center justify-between gap-3 desktop:flex-col desktop:items-start desktop:gap-2 desktop:px-3">
          <Link href={ROUTES.admin} className="inline-flex items-center">
            <HostedLogo name={APP_NAME} size="sm" />
          </Link>
          <span className="rounded-xs bg-surface-soft px-2 py-1 text-badge text-muted">{ADMIN_SHELL_COPY.title}</span>
        </div>
        <AdminNav />
        <div className="desktop:mt-auto">
          <DemoModeToggle enabled={demoMode} />
        </div>
        <div className="hidden border-t border-hairline px-3 pt-4 desktop:flex desktop:flex-col desktop:gap-0.5">
          <span className="text-caption text-muted">{ADMIN_SHELL_COPY.signedInAs}</span>
          <span title={email} className="truncate text-body-sm text-ink">
            {email}
          </span>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="mx-auto flex w-full max-w-page flex-col gap-8 px-4 py-6 tablet:px-8 tablet:py-10">{children}</div>
      </main>
    </div>
  );
}
