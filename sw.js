// Service Worker for Portfolio Website
// Version: 4.0
const CACHE_NAME = "portfolio-cache-v4";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css?v=4",
  "/script.js",
  "/images/image.png",
  "/images/project1-ai-courser.svg",
  "/images/project2-nasr.svg",
  "/images/project3-ai-website.svg",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache v3");
      return cache.addAll(urlsToCache);
    }),
  );
  self.skipWaiting();
});

// Fetch event - Network first, then cache for HTML/JS/CSS, cache first for images
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // For HTML, JS, CSS files - use Network First strategy (always get fresh version)
  if (url.pathname.match(/\.(html|js|css)$/)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update cache with fresh version
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        }),
    );
    return;
  }

  // For images and other assets - use Cache First strategy
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    }),
  );
});

// Activate event - clean up old caches and claim clients immediately
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        // Take control of all clients immediately
        return self.clients.claim();
      }),
  );
});

// Message event - handle skip waiting from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
