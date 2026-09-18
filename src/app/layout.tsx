import type { ReactNode } from 'react';
import { Cal_Sans, Montserrat } from 'next/font/google';
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

export const metadata = { title: 'Provider onboarding' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${calSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
