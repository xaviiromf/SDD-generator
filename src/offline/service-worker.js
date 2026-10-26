const precache = /* PRECACHE */ [];
const cacheName = /* CACHE_NAME */ 'sdd-studio-pendiente';
const worker = self;
worker.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(precache)));
});
worker.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(names =>
        Promise.all(
          names
            .filter(name => name.startsWith('sdd-studio-') && name !== cacheName)
            .map(name => caches.delete(name)),
        ),
      )
      .then(() => worker.clients.claim()),
  );
});
worker.addEventListener('fetch', event => {
  if (
    event.request.method !== 'GET' ||
    new URL(event.request.url).origin !== worker.location.origin
  )
    return;
  const url = new URL(event.request.url);
  // Recursos con hash fuera de la precarga: caché en el primer uso.
  const runtime = !precache.includes(url.pathname) && url.pathname.includes('/assets/');
  if (!precache.includes(url.pathname) && !runtime) return;
  if (runtime) {
    event.respondWith(
      caches.open(cacheName).then(async cache => {
        const cached = await cache.match(url.pathname);
        if (cached) return cached;
        const response = await fetch(event.request);
        if (response.ok) await cache.put(url.pathname, response.clone());
        return response;
      }),
    );
    return;
  }
  event.respondWith(
    caches.open(cacheName).then(async cache => {
      const cached = await cache.match(url.pathname);
      return cached || fetch(event.request);
    }),
  );
});
