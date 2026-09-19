'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAME } from '@/core/constants';
import { HostedLogo } from '@/shared/components';

export interface WebHeaderItem {
  href: string;
  label: string;
}

interface WebHeaderProps {
  /** Omit alongside `onSignOut` for a visitor who is not signed in: the header renders wordmark-only. */
  navItems?: WebHeaderItem[];
  signOutLabel?: string;
  onSignOut?: () => void;
}

/** DESIGN.md `web-header`: host only, tablet and up, replacing `bottom-nav` there. */
export const WebHeader = ({ navItems, signOutLabel, onSignOut }: WebHeaderProps) => {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 hidden h-16 border-b border-hairline bg-sand tablet:flex">
      <div className="mx-auto flex w-full max-w-page items-center gap-6 px-6">
        <HostedLogo name={APP_NAME} size="sm" />
        {navItems?.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={`text-nav-label ${active ? 'text-primary-text' : 'text-muted'}`}>
              {item.label}
            </Link>
          );
        })}
        {onSignOut ? (
          <button type="button" onClick={onSignOut} className="ml-auto text-link text-primary-text underline">
            {signOutLabel}
          </button>
        ) : null}
      </div>
    </header>
  );
};
