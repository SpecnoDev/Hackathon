import Link from 'next/link';
import { ROUTES, SYNC_COPY } from '@/core/constants';

export const metadata = { title: 'No signal' };

/** Served from the service worker cache when a page was never opened online. Must not touch the database. */
export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center gap-6 px-6 text-ink">
      <h1 className="font-display text-display-lg">No signal</h1>
      <p className="text-body-host text-muted">
        {SYNC_COPY.offline}. Pages you have already opened still work. This one needs the internet, so
        try again once you have a connection.
      </p>
      <Link
        href={ROUTES.home}
        className="flex h-14 items-center justify-center rounded-full bg-primary text-button-lg text-on-primary"
      >
        Try again
      </Link>
    </main>
  );
}
