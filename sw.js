const CACHE = "red-button-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.webmanifest"
  // ícones adicionados se existirem
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Cache-first para estáticos locais
  if (request.method === "GET" && new URL(request.url).origin === location.origin) {
    event.respondWith(
      caches.match(request).then(res => res || fetch(request))
    );
  }
});