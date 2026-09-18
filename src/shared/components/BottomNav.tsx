'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from './Icon';

export interface BottomNavItem {
  href: string;
  label: string;
  icon: IconName;
}

interface BottomNavProps {
  items: BottomNavItem[];
  label: string;
}

export const BottomNav = ({ items, label }: BottomNavProps) => {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="flex h-16 border-t border-hairline bg-canvas">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-nav-label ${active ? 'text-primary-text' : 'text-muted'}`}
          >
            {/* Active state is weight, not colour alone: the icon stroke thickens and the label is marked current. */}
            <Icon name={item.icon} className={active ? 'stroke-[2.5]' : ''} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
