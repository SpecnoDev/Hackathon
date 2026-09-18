'use client';

import { useSyncExternalStore } from 'react';
import { connectivityService } from '@/core/services/client';

/** Same shape as the host app's hook; a feature never imports another feature, so each side keeps its own five lines. */
export const useOnline = (): boolean =>
  useSyncExternalStore(connectivityService.subscribe, connectivityService.isOnline, connectivityService.isOnlineOnServer);
