const CACHE_NAME = 'cronologia-biblica-v3'
const MEDIA = ['atlas-hero', 'queda-jerusalem', 'jornada-abraao', 'sinai-deserto', 'jerusalem-reinos', 'retorno-exilio', 'galileia-seculo-i', 'porto-igreja-primitiva']

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
    const scope = self.registration.scope
    await cache.add(new URL('index.html', scope).toString())
    const manifestResponse = await fetch(new URL('.vite/manifest.json', scope))
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json()
      const assets = new Set(Object.values(manifest).flatMap((entry) => [entry.file, ...(entry.css || []), ...(entry.assets || [])]).filter(Boolean))
      await Promise.allSettled([...assets].map((file) => cache.add(new URL(file, scope).toString())))
    }
    const media = MEDIA.flatMap((name) => [`media/v2/${name}.webp`, `media/v2/${name}-sm.webp`])
    media.push('media/v2/textura-papel.webp', 'media/v2/mapa-levante.svg')
    await Promise.allSettled(media.map((file) => cache.add(new URL(file, scope).toString())))
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.filter((name) => name.startsWith('cronologia-biblica-') && name !== CACHE_NAME).map((name) => caches.delete(name)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const cache = await caches.open(CACHE_NAME)
      return (await cache.match(new URL('index.html', self.registration.scope).toString())) || Response.error()
    }))
    return
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME)
    const cached = await cache.match(request)
    if (cached) return cached
    try {
      const response = await fetch(request)
      if (response.ok && response.type === 'basic') await cache.put(request, response.clone())
      return response
    } catch {
      return cached || Response.error()
    }
  })())
})
