const CACHE_NAME = 'ropex-log-v3'; // Opdateret version tvinger opdatering hos brugeren
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// Installation: Gemmer filer i cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Aktivering: Rydder op i gamle caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch: Serverer filer fra cache, selv når man er offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

