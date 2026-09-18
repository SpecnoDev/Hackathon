import type { ReactNode } from 'react';

export const metadata = { title: 'Provider onboarding' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '2rem' }}>{children}</body>
    </html>
  );
}
