import type { HostAppState } from '../interfaces';

const DB_NAME = 'host-app';
const DB_VERSION = 1;
const STATE_STORE = 'state';
const BLOB_STORE = 'blobs';
const SNAPSHOT_KEY = 'snapshot';

let database: Promise<IDBDatabase> | undefined;

const open = (): Promise<IDBDatabase> => {
  database ??= new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      [STATE_STORE, BLOB_STORE].forEach((name) => {
        if (!request.result.objectStoreNames.contains(name)) request.result.createObjectStore(name);
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return database;
};

const run = async <T>(store: string, mode: IDBTransactionMode, operation: (target: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
  const db = await open();
  return new Promise((resolve, reject) => {
    const request = operation(db.transaction(store, mode).objectStore(store));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/** A host in private browsing, or on a phone with no storage left, still gets a working app; it just will not resume. */
const orUndefined = async <T>(work: () => Promise<T>): Promise<T | undefined> => {
  try {
    return await work();
  } catch {
    return undefined;
  }
};

/**
 * Local persistence for the host prototype: one state snapshot plus the blobs it points at
 * (voice notes, listing photos, ID captures). IndexedDB directly, as docs/TECH_STACK.md specifies.
 */
export const hostAppStorage = {
  loadSnapshot: (): Promise<HostAppState | undefined> => orUndefined(() => run<HostAppState | undefined>(STATE_STORE, 'readonly', (store) => store.get(SNAPSHOT_KEY))),

  saveSnapshot: (state: HostAppState): Promise<unknown> => orUndefined(() => run(STATE_STORE, 'readwrite', (store) => store.put(state, SNAPSHOT_KEY))),

  putBlob: (key: string, blob: Blob): Promise<unknown> => orUndefined(() => run(BLOB_STORE, 'readwrite', (store) => store.put(blob, key))),

  getBlob: (key: string): Promise<Blob | undefined> => orUndefined(() => run<Blob | undefined>(BLOB_STORE, 'readonly', (store) => store.get(key))),

  deleteBlob: (key: string): Promise<unknown> => orUndefined(() => run(BLOB_STORE, 'readwrite', (store) => store.delete(key))),

  clear: async (): Promise<void> => {
    await orUndefined(() => run(STATE_STORE, 'readwrite', (store) => store.clear()));
    await orUndefined(() => run(BLOB_STORE, 'readwrite', (store) => store.clear()));
  },
};
