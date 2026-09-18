/** Identity the installed app carries on a home screen. Colours are DESIGN.md primary and canvas. */
export const PWA_NAME = 'Hosted';
export const PWA_SHORT_NAME = 'Hosted';
export const PWA_DESCRIPTION =
  'List what you offer by voice, take bookings and get paid — works without signal.';
export const PWA_THEME_COLOR = '#009A4E';
export const PWA_BACKGROUND_COLOR = '#FFFFFF';

export const SERVICE_WORKER_PATH = '/sw.js';
export const APP_ICONS = {
  any192: '/icons/icon-192.png',
  any512: '/icons/icon-512.png',
  maskable512: '/icons/icon-maskable-512.png',
  appleTouch: '/icons/apple-touch-icon.png',
} as const;

export const LOCAL_DB_NAME = 'marketplace';
export const LOCAL_DB_VERSION = 1;

/** `drafts` holds work in progress, `outbox` the writes still owed to the API. */
export const LOCAL_STORES = { drafts: 'drafts', outbox: 'outbox' } as const;
export type LocalStore = (typeof LOCAL_STORES)[keyof typeof LOCAL_STORES];

/** A write that keeps failing is dropped rather than retried forever on a metered connection. */
export const OUTBOX_MAX_ATTEMPTS = 5;

export const SYNC_COPY = {
  offline: 'No signal · your work is saved on this phone',
  pendingOne: 'Saved on your phone · 1 change waiting to upload',
  pendingMany: (count: number) => `Saved on your phone · ${count} changes waiting to upload`,
  uploading: 'Uploading your changes…',
  queued: 'Saved on your phone · it will upload when you have signal',
} as const;
