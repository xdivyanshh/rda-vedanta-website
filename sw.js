const CACHE_NAME = 'rda-vedanta-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/our-team.html',
    '/src/css/base.css',
    '/src/css/variables.css',
    '/src/css/layout.css',
    '/src/css/components.css',
    '/src/css/sections.css',
    '/manifest.json',
    '/src/assets/images/icon-192x192.png',
    '/src/assets/images/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // Activate new service worker immediately instead of waiting
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Delete old caches so stale assets don't interfere
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            // Not in cache — fetch from network normally
            return fetch(event.request);
        }).catch(() => {
            // Network failed and no cache — let the browser handle it naturally
            return new Response('', { status: 408, statusText: 'Offline' });
        })
    );
});
