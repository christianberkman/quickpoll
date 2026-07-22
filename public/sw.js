const CACHE = "v260718";

const PRECACHE = [
  // Your files
  "/adjust.html",
  "/index.html",
  "/poll.html",
  "/question.html",
  "/results.html",
  "/settings.html",

  "/js/adjust.js",
  "/js/poll.js",
  "/js/quickpoll.js",
  "/js/question.js",
  "/js/results.js",
  "/js/settings.js",

  "/bootswatch-vapor.min.css",

  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/fonts/bootstrap-icons.woff2",
  "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
  "https://fonts.gstatic.com/s/lato/v25/S6uyw4BMUTPHjx4wXg.woff2",
];

/**
 * Install, pre-cache
 */
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE.map((url) =>
            cache
              .add(url)
              .catch((err) => console.warn("Failed to cache:", url, err)),
          ),
        ),
      ),
  );
  self.skipWaiting();
  console.log("Servie Worker installed");
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
