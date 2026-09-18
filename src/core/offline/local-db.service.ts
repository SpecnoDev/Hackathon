import { LOCAL_DB_NAME, LOCAL_DB_VERSION, LOCAL_STORES, LocalStore } from '@/core/constants';

export interface LocalRecord {
  readonly id: string;
}

const awaited = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

let connection: Promise<IDBDatabase> | undefined;

const open = (): Promise<IDBDatabase> =>
  (connection ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCAL_DB_NAME, LOCAL_DB_VERSION);

    request.onupgradeneeded = () =>
      Object.values(LOCAL_STORES)
        .filter((store) => !request.result.objectStoreNames.contains(store))
        .forEach((store) => request.result.createObjectStore(store, { keyPath: 'id' }));

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }));

const transact = async <T>(
  store: LocalStore,
  mode: IDBTransactionMode,
  run: (objectStore: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => awaited(run((await open()).transaction(store, mode).objectStore(store)));

export const putLocal = async <T extends LocalRecord>(store: LocalStore, record: T): Promise<T> => {
  await transact(store, 'readwrite', (objectStore) => objectStore.put(record));

  return record;
};

export const getLocal = <T extends LocalRecord>(store: LocalStore, id: string): Promise<T | undefined> =>
  transact(store, 'readonly', (objectStore) => objectStore.get(id) as IDBRequest<T | undefined>);

export const allLocal = <T extends LocalRecord>(store: LocalStore): Promise<T[]> =>
  transact(store, 'readonly', (objectStore) => objectStore.getAll() as IDBRequest<T[]>);

export const deleteLocal = async (store: LocalStore, id: string): Promise<void> => {
  await transact(store, 'readwrite', (objectStore) => objectStore.delete(id));
};
