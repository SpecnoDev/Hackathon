'use client';

import { useMemo, useSyncExternalStore } from 'react';
import type { HostAppState } from '../interfaces';
import { hostAppStore } from '../services';

const notReadyOnServer = (): boolean => false;

/** Reads from the host store. The selector runs against one stable snapshot, so it may build new arrays freely. */
export const useHostApp = <T>(selector: (state: HostAppState) => T): T => {
  const state = useSyncExternalStore(hostAppStore.subscribe, hostAppStore.getState, hostAppStore.getServerState);
  return useMemo(() => selector(state), [selector, state]);
};

/** False until the saved state has loaded from the phone. Screens show a skeleton until then, so nothing flashes. */
export const useHostAppReady = (): boolean => useSyncExternalStore(hostAppStore.subscribe, hostAppStore.isReady, notReadyOnServer);
