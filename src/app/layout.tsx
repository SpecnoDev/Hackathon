import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Cal_Sans, Montserrat } from 'next/font/google';
import { APP_ICONS, PWA_NAME, PWA_SHORT_NAME, PWA_THEME_COLOR } from '@/core/constants';
import { SyncStatus } from '@/core/layout';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
});

const calSans = Cal_Sans({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cal-sans',
  display: 'swap',
  // next/font has no metrics for Cal Sans, so it cannot size a fallback to match; without this the build warns on every run.
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: PWA_NAME,
  // Next links app/manifest.ts automatically; iOS reads none of it and needs these two.
  appleWebApp: { capable: true, title: PWA_SHORT_NAME, statusBarStyle: 'default' },
  icons: { apple: APP_ICONS.appleTouch },
};

export const viewport: Viewport = { themeColor: PWA_THEME_COLOR };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${calSans.variable}`}>
      <body>
        <SyncStatus />
        {children}
      </body>
    </html>
  );
}
