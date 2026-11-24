/* Offline-Fähigkeit: App-Dateien aus dem Netz, nach 3 s ohne Antwort oder ohne Netz aus dem Zwischenspeicher.
   Eine verspätete Antwort aus dem Netz landet trotzdem im Zwischenspeicher. Daten laufen nie über den Cache.
   Abrufe tragen ?v=<Version>: GitHub Pages hält Dateien sonst bis zu 10 min im CDN, und eine neue Version
   bekäme noch die alte index.html. Gespeichert wird unter der Adresse ohne Zusatz. */
const CACHE = 'tri-v181';
const FILES = ['./', './index.html', './app.js', './uebungen.js', './morphdom.min.js', './manifest.webmanifest', './icons/icon-180.png', './icons/icon-192.png'];
const WAIT = 3000;
const bust = u => { const x = new URL(u, location.href); x.searchParams.set('v', CACHE); return x.href; };

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => fetch(bust(f), { cache: 'reload' }).then(r => { if (!r.ok) throw new Error(f); return c.put(f, r); })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  const net = fetch(e.request.mode === 'navigate' ? bust(url.pathname) : bust(e.request.url), { cache: 'no-cache' }).then(res => {
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
