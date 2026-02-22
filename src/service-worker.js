// Nome della cache
const CACHE_NAME = "pwa-cache-v3";

// File statici da mettere in cache all'installazione
const FILES_TO_CACHE = [
    "/manifest.json",
    "/offline.html",
    "/icons/icon-192.png"
];

// Installazione → cache iniziale dei file statici
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("📦 Caching iniziale...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Attivazione → elimina vecchie cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("🗑️ Elimino cache vecchia:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch → distingue file dinamici (php, json) da statici
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Se la richiesta è per PHP o JSON → vai sempre al server
  if (url.pathname.endsWith(".php") || url.pathname.endsWith(".json")) {
    event.respondWith(fetch(event.request).catch(() => {
      return caches.match("/offline.html");
    }));
    return;
  }

  // Per tutto il resto → prova cache, altrimenti rete
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
