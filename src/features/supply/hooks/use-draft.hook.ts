'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { HostAppState, OfferingDraft } from '../interfaces';
import { useHostApp, useHostAppReady } from './use-host-app.hook';

export const useDraft = (key: string): OfferingDraft | undefined =>
  useHostApp(useCallback((state: HostAppState) => state.drafts[key], [key]));

/** A draft screen opened with no draft behind it (a stale link, a cleared phone) goes somewhere useful instead of breaking. */
export const useRequireDraft = (key: string, fallbackHref: string): OfferingDraft | undefined => {
  const router = useRouter();
  const ready = useHostAppReady();
  const draft = useDraft(key);

  useEffect(() => {
    if (ready && !draft) router.replace(fallbackHref);
  }, [ready, draft, fallbackHref, router]);

  return draft;
};
