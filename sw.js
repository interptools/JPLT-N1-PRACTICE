/* N1 漢字練習帳 — offline service worker
   SHELL   : versioned, holds the app's own files. Replaced on each update.
   RUNTIME : not versioned, holds the stroke-order library and web fonts.
   STROKES : not versioned, holds per-character stroke data you have downloaded.
   Only SHELL is cleared on update, so a downloaded kanji set survives upgrades. */

const VERSION = 'v7';
const SHELL   = 'n1-shell-' + VERSION;
const RUNTIME = 'n1-runtime';
const STROKES = 'n1-strokes';

const SHELL_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

const LIB = 'https://cdn.jsdelivr.net/npm/hanzi-writer@3/dist/hanzi-writer.min.js';

const isStrokeData = url => url.includes('hanzi-writer-data');
const isLib        = url => url.includes('cdn.jsdelivr.net');
const isFont       = url => url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com');

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const shell = await caches.open(SHELL);
    // one at a time: a single 404 shouldn't abort the whole install
    await Promise.all(SHELL_FILES.map(f => shell.add(new Request(f, { cache: 'reload' })).catch(() => {})));
    const rt = await caches.open(RUNTIME);
    await rt.add(new Request(LIB, { mode: 'cors' })).catch(() => {});
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keep = [SHELL, RUNTIME, STROKES];
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.startsWith('n1-') && !keep.includes(n)).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

async function cacheFirst(req, cacheName, corsFetch) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req, { ignoreVary: true });
  if (hit) return hit;
  const res = await fetch(corsFetch ? new Request(req.url, { mode: 'cors', credentials: 'omit' }) : req);
  if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = req.url;

  // App pages: try the network so updates land, fall back to the cached shell.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(SHELL);
        cache.put('./index.html', fresh.clone()).catch(() => {});
        return fresh;
      } catch (err) {
        const cache = await caches.open(SHELL);
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  if (isStrokeData(url)) { e.respondWith(cacheFirst(req, STROKES, true).catch(() => new Response('', { status: 504 }))); return; }
  if (isFont(url) || isLib(url)) { e.respondWith(cacheFirst(req, RUNTIME, true).catch(() => new Response('', { status: 504 }))); return; }

  if (new URL(url).origin === self.location.origin) {
    e.respondWith(cacheFirst(req, SHELL, false).catch(() => new Response('', { status: 504 })));
  }
});
