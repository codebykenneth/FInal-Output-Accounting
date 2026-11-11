// Keeps the app opening even with a weak connection. Firebase data requests are never touched.
const C = 'accounting-v8', FILES = ['index.xml', 'app.js', 'firebase-config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r,{cache:'no-cache'}).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('index.xml'))));
});
