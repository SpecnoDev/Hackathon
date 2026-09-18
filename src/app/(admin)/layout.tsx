import Link from 'next/link';
import type { ReactNode } from 'react';
import { requireAdminPage } from '@/core/guards';
import { ROUTES } from '@/core/constants';

export const metadata = { title: 'Backoffice' };

const NAV = [
  { href: ROUTES.admin, label: 'Overview' },
  { href: ROUTES.adminHosts, label: 'Hosts' },
  { href: ROUTES.adminTravellers, label: 'Travellers' },
  { href: ROUTES.adminOfferings, label: 'Offerings' },
  { href: ROUTES.adminAudit, label: 'Audit trail' },
] as const;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { email } = await requireAdminPage();

  return (
    <div className="min-h-dvh bg-surface-soft">
      <header className="border-b border-hairline bg-canvas">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-6 px-4">
          <span className="text-title-sm text-ink">Backoffice</span>
          <nav className="flex flex-1 gap-4">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="text-body-sm text-muted hover:text-ink">
                {label}
              </Link>
            ))}
          </nav>
          <span className="text-body-sm text-muted">{email}</span>
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-4 py-8">{children}</main>
    </div>
  );
}
