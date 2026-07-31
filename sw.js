const CACHE_NAME = 'vm-one-marks-v3'; // bumped again for the Settings/Firebase-resiliency fix
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

/* Network-first for EVERYTHING. Every request tries the real server first
   (bypassing the HTTP cache with {cache:'no-store'}), so students always get
   the newest index.html/script.js/styles.css the moment you update them.
   The cache is only ever used as a fallback when there's no network at all —
   and it's kept fresh in the background on every successful fetch. */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req, { cache: 'no-store' })
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
      )
  );
});
