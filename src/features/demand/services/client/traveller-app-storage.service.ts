import type { TravellerAppState } from '../../interfaces';

const DB_NAME = 'traveller-app';
const DB_VERSION = 1;
const STATE_STORE = 'state';
const SNAPSHOT_KEY = 'snapshot';

let database: Promise<IDBDatabase> | undefined;

const open = (): Promise<IDBDatabase> => {
  database ??= new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STATE_STORE)) request.result.createObjectStore(STATE_STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return database;
};

const run = async <T>(mode: IDBTransactionMode, operation: (target: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
  const db = await open();
  return new Promise((resolve, reject) => {
    const request = operation(db.transaction(STATE_STORE, mode).objectStore(STATE_STORE));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/** A traveller in private browsing still gets a working app; it just will not remember them. */
const orUndefined = async <T>(work: () => Promise<T>): Promise<T | undefined> => {
  try {
    return await work();
  } catch {
    return undefined;
  }
};

/** Local persistence for the traveller prototype, the same way the host prototype keeps its state. */
export const travellerAppStorage = {
  loadSnapshot: (): Promise<TravellerAppState | undefined> => orUndefined(() => run<TravellerAppState | undefined>('readonly', (store) => store.get(SNAPSHOT_KEY))),
  saveSnapshot: (state: TravellerAppState): Promise<unknown> => orUndefined(() => run('readwrite', (store) => store.put(state, SNAPSHOT_KEY))),
  clear: (): Promise<unknown> => orUndefined(() => run('readwrite', (store) => store.clear())),
};
