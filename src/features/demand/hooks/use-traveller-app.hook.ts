'use client';

import { useMemo, useSyncExternalStore } from 'react';
import type { TravellerAppState } from '../interfaces';
import { travellerAppStore } from '../services/client';

const notReadyOnServer = (): boolean => false;

/** Reads from the traveller store. The selector runs against one stable snapshot, so it may build new arrays freely. */
export const useTravellerApp = <T>(selector: (state: TravellerAppState) => T): T => {
  const state = useSyncExternalStore(travellerAppStore.subscribe, travellerAppStore.getState, travellerAppStore.getServerState);
  return useMemo(() => selector(state), [selector, state]);
};

/** False until the saved state has loaded from the phone, so nothing flashes from seeded to saved. */
export const useTravellerReady = (): boolean => useSyncExternalStore(travellerAppStore.subscribe, travellerAppStore.isReady, notReadyOnServer);
