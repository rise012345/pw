// オフラインでも起動できるよう、アプリ本体（index.html）だけをキャッシュする。
// パスワードのデータは扱わない（データは localStorage に暗号化して保存）。
const CACHE = 'pw-app-v1';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html'])));
  self.skipWaiting();
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// 通信できるときは最新版を取得、できないときはキャッシュから表示
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
