'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useToast } from '@/shared/components';
import { COPY_COMMON, TRAVELLER_ROUTES } from '../constants';
import { useSavedListingsState } from '../hooks';

interface SavedListings {
  savedIds: Set<string>;
  toggleSaved: (offeringId: string) => void;
}

const SavedListingsContext = createContext<SavedListings>({ savedIds: new Set(), toggleSaved: () => undefined });

/** One fetch of the saved ids for the whole traveller app, so every heart on every rail agrees. */
export const SavedListingsProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();
  const { savedIds, toggleSaved: settle } = useSavedListingsState();

  const toggleSaved = useCallback(
    (offeringId: string) => {
      void settle(offeringId).then((saved) => toast(saved === undefined ? COPY_COMMON.saved.signIn : saved ? COPY_COMMON.saved.added : COPY_COMMON.saved.removed, saved === undefined ? TRAVELLER_ROUTES.login : undefined));
    },
    [settle, toast],
  );

  const value = useMemo(() => ({ savedIds, toggleSaved }), [savedIds, toggleSaved]);
  return <SavedListingsContext.Provider value={value}>{children}</SavedListingsContext.Provider>;
};

export const useSavedListings = (): SavedListings => useContext(SavedListingsContext);
