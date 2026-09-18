'use client';

import { useSyncExternalStore } from 'react';
import { connectivityService } from '@/core/services/client';

export const useOnline = (): boolean =>
  useSyncExternalStore(connectivityService.subscribe, connectivityService.isOnline, connectivityService.isOnlineOnServer);
