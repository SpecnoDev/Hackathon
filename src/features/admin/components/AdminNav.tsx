'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/core/constants';
import { Icon } from '@/shared/components';
import { ADMIN_NAV, ADMIN_SHELL_COPY } from '../constants';

const NAV_ICON_PX = 20;
const ITEM = 'flex min-h-11 shrink-0 items-center gap-3 whitespace-nowrap rounded-md px-3 text-nav-label transition-colors motion-reduce:transition-none';
const ITEM_ON = 'bg-primary-tint text-primary-text';
const ITEM_OFF = 'text-muted hover:bg-sand hover:text-ink';

/** The overview is the root, so only an exact match lights it; every other section owns its subtree. */
const isActive = (pathname: string, href: string): boolean =>
  href === ROUTES.admin ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

/** A row on a phone, a column beside the content from the desktop breakpoint. */
export const AdminNav = () => {
  const pathname = usePathname();

  return (
    <nav aria-label={ADMIN_SHELL_COPY.navLabel} className="flex gap-1 overflow-x-auto desktop:flex-col desktop:overflow-visible">
      {ADMIN_NAV.map(({ href, label, icon }) => {
        const active = isActive(pathname, href);

        return (
          <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`${ITEM} ${active ? ITEM_ON : ITEM_OFF}`}>
            <Icon name={icon} size={NAV_ICON_PX} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
