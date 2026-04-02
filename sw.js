const CACHE_NAME = 'rda-vedanta-v5';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/leadership/',
    '/products/',
    '/contact/',
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
            // Cache each asset individually so if one fails (e.g. 404), 
            // the entire Service Worker installation doesn't abort.
            return Promise.all(
                ASSETS_TO_CACHE.map(asset => 
                    cache.add(asset).catch(err => console.warn('SW Install: Failed to cache asset:', asset, err))
                )
            );
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
    // Only intercept GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Make a clone of the response to put in the cache
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // If network fails (offline), fall back to cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return new Response('', { status: 408, statusText: 'Offline' });
                });
            })
    );
});
