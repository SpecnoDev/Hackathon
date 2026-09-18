'use client';

import { useEffect, useState } from 'react';
import { SERVICE_WORKER_PATH, SYNC_COPY } from '@/core/constants';
import { startSync, watchOutbox } from '@/core/offline';
import { OfflineBanner } from '@/shared/components';

const pendingCopy = (pending: number): string =>
  pending === 1 ? SYNC_COPY.pendingOne : SYNC_COPY.pendingMany(pending);

/**
 * Registers the service worker and carries the whole app's sync state, so every screen says the
 * same thing about signal without each one wiring it up. The bar itself is shared/components'
 * OfflineBanner — this decides only whether it shows and what it says.
 */
export function SyncStatus() {
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    // Dev serves fresh chunks on every edit; a cache-first worker would hand back yesterday's.
    if (process.env.NODE_ENV === 'production')
      void navigator.serviceWorker?.register(SERVICE_WORKER_PATH).catch(() => undefined);

    const read = () => setOnline(navigator.onLine);
    read();
    window.addEventListener('online', read);
    window.addEventListener('offline', read);

    const stopSync = startSync();
    const stopWatching = watchOutbox(setPending);

    return () => {
      window.removeEventListener('online', read);
      window.removeEventListener('offline', read);
      stopSync();
      stopWatching();
    };
  }, []);

  if (online && pending === 0) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <OfflineBanner
        message={online ? SYNC_COPY.uploading : pending > 0 ? pendingCopy(pending) : SYNC_COPY.offline}
      />
    </div>
  );
}
