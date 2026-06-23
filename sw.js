const CACHE = "v260623A";

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

  "/quickpoll/bootswatch-vapor.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/fonts/bootstrap-icons.woff2",
  "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
  "https://fonts.gstatic.com/s/lato/v25/S6uyw4BMUTPHjx4wXg.woff2",
];

/**
 * Install, pre-cache
 */
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
  console.log("Service Worker Installed");
});

/**
 * Delete old caches
 */
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

/**
 *  Serve from cache first
 */
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request)),
  );
});

/**
 * Send CACHE version
 */
self.addEventListener("message", (e) => {
  if (e.data.type === "GET_VERSION") {
    e.source.postMessage({ version: CACHE });
  }
});
