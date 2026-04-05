
const CACHE_NAME = 'isthmic-sovereign-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/index.css',
  '/index.tsx',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/functions/v1/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        fetch(event.request).then((response) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
          });
        }).catch(() => {});
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch((err) => {
        console.error(`❌ [SW] Fetch failed for ${event.request.url}:`, err);
        // Return a custom error response instead of letting the browser throw "Failed to fetch"
        return new Response(JSON.stringify({ error: 'OFFLINE_OR_NETWORK_ERROR', details: err.message }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      });
    })
  );
});
