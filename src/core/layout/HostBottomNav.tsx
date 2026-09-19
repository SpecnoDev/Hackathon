'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/core/constants';

const NAV_ITEMS = [
  { href: ROUTES.host, label: 'Home', icon: 'M4 11 12 4l8 7M6 10v10h12V10' },
  { href: ROUTES.hostListings, label: 'Listings', icon: 'M4 6h16M4 12h16M4 18h10' },
  { href: ROUTES.hostBookings, label: 'Bookings', icon: 'M8 3v4m8-4v4M4 9h16M5 5h14v15H5zm4 8h6' },
  { href: ROUTES.hostEarnings, label: 'Earnings', icon: 'M3 7h18v11H3zm0 4h18M7 15h3' },
] as const;

export function HostBottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith(ROUTES.hostOnboarding)) return null;

  return (
    <nav className="sticky bottom-0 flex h-16 shrink-0 items-stretch border-t border-hairline bg-sand">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = href === ROUTES.host ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-1 ${isActive ? 'text-primary-text' : 'text-muted'}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d={icon} />
            </svg>
            <span className="text-nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
