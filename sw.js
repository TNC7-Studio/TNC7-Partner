const CACHE_NAME = 'tnc7-pwa-v2';

// Daftar file yang akan disimpan di cache agar bisa dibuka saat offline
const urlsToCache = [
  './',
  './revenue_calculator.html',
  './manifest.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if found, otherwise fetch from network
                return response || fetch(event.request).catch(() => {
                    // Fallback saat offline dan file tidak ada di cache
                    return new Response("Offline Mode: Tidak ada koneksi internet.");
                });
            })
    );
});
