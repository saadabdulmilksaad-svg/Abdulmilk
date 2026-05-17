// Service Worker for Portfolio Website
// Version: 10.0
const CACHE_NAME = "portfolio-cache-v10";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./images/image.webp",
  "./images/project1-ai-courser.svg",
  "./images/project2-nasr.svg",
  "./images/project3-ai-website.svg",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache v9");
      return cache.addAll(urlsToCache);
    }),
  );
  // تفعيل السيرفس ووركر الجديد فوراً بدون انتظار
  self.skipWaiting();
});

// Activate event - حذف الكاش القديم والسيطرة على جميع الصفحات فوراً
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
        // السيطرة على جميع العملاء فوراً
        return self.clients.claim();
      }),
  );
});

// Fetch event - Network First Strategy (الشبكة أولاً، ثم الكاش كبديل)
// هذا يضمن ظهور التغييرات فوراً عند تعديل الكود
self.addEventListener("fetch", (event) => {
  // تجاهل طلبات POST والطلبات الخارجية
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // إذا نجح الطلب من الشبكة، حدّث الكاش واعرض النسخة الجديدة
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // إذا فشلت الشبكة (لا إنترنت)، ارجع للكاش
        return caches.match(event.request);
      })
  );
});

// Message event - handle skip waiting from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
