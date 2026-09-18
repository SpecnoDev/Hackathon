'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { ROUTES } from '@/core/constants';

const NAV_ITEMS = [
  { href: ROUTES.explore, label: 'Explore', icon: ExploreIcon },
  { href: ROUTES.trips, label: 'Trips', icon: TripsIcon },
  { href: ROUTES.bookings, label: 'Bookings', icon: BookingsIcon },
  { href: ROUTES.profile, label: 'Profile', icon: ProfileIcon },
] as const;

const isActive = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 flex h-16 border-t border-hairline bg-canvas"
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-1 ${
              active ? 'text-primary-text' : 'text-muted'
            }`}
          >
            <Icon filled={active} />
            <span className="text-nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

type IconProps = { filled: boolean };

function ExploreIcon({ filled }: IconProps): ReactNode {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5 12 14l-2.5-4.5L12 8z" fill={filled ? 'currentColor' : 'none'} />
    </svg>
  );
}

function TripsIcon({ filled }: IconProps): ReactNode {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 3v6M16 3v6M3 11h18" />
    </svg>
  );
}

function BookingsIcon({ filled }: IconProps): ReactNode {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12.5 11 14.5 15.5 9.5" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function ProfileIcon({ filled }: IconProps): ReactNode {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" />
    </svg>
  );
}
