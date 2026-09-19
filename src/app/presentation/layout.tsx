import type { ReactNode } from 'react';
import { APP_NAME } from '@/core/constants';

export const metadata = { title: `${APP_NAME} · the pitch` };

export default function PresentationLayout({ children }: { children: ReactNode }) {
  return children;
}
