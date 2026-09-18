type Listener = () => void;

const SIMULATED_OFFLINE_KEY = 'connectivity.simulatedOffline';
const FLAG_ON = '1';

const listeners = new Set<Listener>();
const notify = (): void => listeners.forEach((listener) => listener());

const isBrowser = (): boolean => typeof window !== 'undefined';

const readSimulatedOffline = (): boolean =>
  isBrowser() && window.sessionStorage.getItem(SIMULATED_OFFLINE_KEY) === FLAG_ON;

/**
 * One shared online/offline signal for the app shell and the outbox.
 * `setSimulatedOffline` exists so the offline states can be demoed without dropping the network.
 */
export const connectivityService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    if (listeners.size === 1 && isBrowser()) {
      window.addEventListener('online', notify);
      window.addEventListener('offline', notify);
    }
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && isBrowser()) {
        window.removeEventListener('online', notify);
        window.removeEventListener('offline', notify);
      }
    };
  },

  isOnline: (): boolean => !isBrowser() || (window.navigator.onLine && !readSimulatedOffline()),

  isOnlineOnServer: (): boolean => true,

  isSimulatedOffline: readSimulatedOffline,

  setSimulatedOffline(offline: boolean): void {
    if (!isBrowser()) return;
    if (offline) window.sessionStorage.setItem(SIMULATED_OFFLINE_KEY, FLAG_ON);
    else window.sessionStorage.removeItem(SIMULATED_OFFLINE_KEY);
    notify();
  },
};
