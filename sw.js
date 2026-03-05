const CACHE_NAME = 'rw-log-v1';
const ASSETS_TO_CACHE = [
  'index.html',
  'manifest.json',
  // Tilføj stien til dit logo/ikon herunder:
  'icon-192.png'
];

// Installerer Service Worker og gemmer filer i cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Aktivering og oprydning af gammel cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Strategi: Prøv netværk først, fald tilbage på cache hvis offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});