/* Offline-Fähigkeit: App-Dateien aus dem Netz, nach 3 s ohne Antwort oder ohne Netz aus dem Zwischenspeicher.
   Eine verspätete Antwort aus dem Netz landet trotzdem im Zwischenspeicher. Daten laufen nie über den Cache. */
const CACHE = 'tri-v129';
const FILES = ['./', './index.html', './app.js', './uebungen.js', './morphdom.min.js', './manifest.webmanifest', './icons/icon-180.png', './icons/icon-192.png'];
const WAIT = 3000;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const net = fetch(e.request, { cache: 'no-cache' }).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  });
  e.waitUntil(net.catch(() => {}));
  const fromCache = () => caches.match(e.request).then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined));
  e.respondWith(new Promise(resolve => {
    let done = false;
    const finish = r => { if (!done && r) { done = true; resolve(r); } };
    const fallback = () => fromCache().then(r => { if (r) finish(r); else net.then(finish, () => finish(Response.error())); });
    const timer = setTimeout(fallback, WAIT);
    net.then(r => { clearTimeout(timer); finish(r); }, () => { clearTimeout(timer); fallback(); });
  }));
});
