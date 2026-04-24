// My Travels — Service Worker
// Minimal SW required for PWA installability and share target support.

const CACHE = 'my-travels-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Cache-first for static assets, network-first for everything else
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Let the app handle /import (share target) navigation
  if (url.pathname === '/import') {
    e.respondWith(fetch(e.request).catch(() => caches.match('/')));
    return;
  }

  // Network-first for API calls
  if (url.origin !== location.origin) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache-first for local assets
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fresh = fetch(e.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      });
      return cached ?? fresh;
    })
  );
});
