const CACHE = "app-v260623";

const PRECACHE = [
  // Your files
  "/quickpoll/index.html",
  "/quickpoll/poll.html",
  "/quickpoll/quickpoll.css",
  "/quickpoll/results.html",
  "/quickpoll/settings.html",
  "/quickpoll/js/index.js",
  "/quickpoll/js/poll.js",
  "/quickpoll/js/quickpoll.js",
  "/quickpoll/js/results.js",
  "/quickpoll/js/settings.js",

  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/fonts/bootstrap-icons.woff2",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
  console.log("Service Worker Installed");
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
  console.log("Cache pre-loaded");
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request)),
  );
});
