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
    '/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached asset if found, otherwise fetch from network
            return response || fetch(event.request);
        }).catch(() => {
            // Optionally provide an offline fallback here
        })
    );
});
