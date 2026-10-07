const precache = /* PRECACHE */ [];
const cacheName = /* CACHE_NAME */ 'sdd-studio-pendiente';
const worker = self;
worker.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(precache)));
});
worker.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(names => Promise.all(names.filter(name => name.startsWith('sdd-studio-') && name !== cacheName).map(name => caches.delete(name)))).then(() => worker.clients.claim()));
});
worker.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== worker.location.origin) return;
  const url = new URL(event.request.url);
  if (!precache.includes(url.pathname)) return;
  event.respondWith(caches.open(cacheName).then(async cache => {
    const cached = await cache.match(url.pathname);
    return cached || fetch(event.request);
  }));
});
