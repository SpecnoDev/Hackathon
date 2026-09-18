/*
 * Hand-written per docs/TECH_STACK.md. Bump VERSION whenever this file changes: the caches are
 * keyed by it and the old ones are dropped on activate, which is the only cache invalidation there is.
 */
const VERSION = 'v1';
const SHELL_CACHE = `shell-${VERSION}`;
const PAGE_CACHE = `pages-${VERSION}`;
const DATA_CACHE = `data-${VERSION}`;
const PHOTO_CACHE = `photos-${VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, PAGE_CACHE, DATA_CACHE, PHOTO_CACHE];

const OFFLINE_URL = '/offline';
const SHELL_ASSETS = [
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
];

const CACHEABLE_API_PATHS = ['/api/v1/offerings', '/api/v1/trips'];
const PHOTO_PATH = '/_next/image';
const STATIC_PATHS = ['/_next/static', '/icons/'];
const PHOTO_HOSTS = ['images.unsplash.com'];

/** Photos and listings are the two that grow without a ceiling, so both are capped. */
const CACHE_LIMITS = { [PHOTO_CACHE]: 60, [PAGE_CACHE]: 30, [DATA_CACHE]: 30 };

const OFFLINE_RESPONSE = () =>
  Response.json(
    { error: { code: 'OFFLINE', message: 'You are offline and this has not been saved on your phone yet.' } },
    { status: 503 },
  );

const trim = async (cache, cacheName) => {
  const limit = CACHE_LIMITS[cacheName];
  const keys = await cache.keys();

  await Promise.all(keys.slice(0, Math.max(keys.length - limit, 0)).map((key) => cache.delete(key)));
};

const store = async (cacheName, request, response) => {
  if (!response.ok || response.type === 'opaqueredirect') return;

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
  await trim(cache, cacheName);
};

const networkFirst = async (request, cacheName, fallback) => {
  try {
    const response = await fetch(request);
    await store(cacheName, request, response);

    return response;
  } catch {
    return (await caches.match(request)) ?? (await fallback());
  }
};

const cacheFirst = async (request, cacheName) => {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  await store(cacheName, request, response);

  return response;
};

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => !CURRENT_CACHES.includes(name)).map((name) => caches.delete(name))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Writes belong to the outbox in core/services/sync.service.ts, never to a cache.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (PHOTO_HOSTS.includes(url.hostname)) return event.respondWith(cacheFirst(request, PHOTO_CACHE));
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate')
    return event.respondWith(
      networkFirst(request, PAGE_CACHE, async () => (await caches.match(OFFLINE_URL)) ?? Response.error()),
    );

  if (url.pathname.startsWith(PHOTO_PATH)) return event.respondWith(cacheFirst(request, PHOTO_CACHE));
  if (CACHEABLE_API_PATHS.some((path) => url.pathname.startsWith(path)))
    return event.respondWith(networkFirst(request, DATA_CACHE, OFFLINE_RESPONSE));

  // Everything else under the API is auth, a session or someone else's data: never cached.
  if (url.pathname.startsWith('/api/')) return;

  if (STATIC_PATHS.some((path) => url.pathname.startsWith(path))) return event.respondWith(cacheFirst(request, SHELL_CACHE));
});
