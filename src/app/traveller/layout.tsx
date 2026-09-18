import type { ReactNode } from 'react';
import { BottomNav } from '@/core/layout';

export default function TravellerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
