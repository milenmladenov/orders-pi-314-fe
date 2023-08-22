export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js') // Path to your service worker script
          .then((registration) => {
            console.log('Service Worker registered:', registration);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }
//   self.addEventListener('install', (event) => {
//     event.waitUntil(
//       caches.open('app-cache').then((cache) => {
//         return cache.addAll([
//           // List of URLs to cache
//         ]);
//       })
//     );
//   });
  
//   self.addEventListener('fetch', (event) => {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         return response || fetch(event.request);
//       })
//     );
//   });
  
 
  self.addEventListener("activate", function (event) {
    event.waitUntil(
      this.caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames
            .filter(function (cacheName) {
              return true;
            })
            .map(function (cacheName) {
              return caches.delete(cacheName);
            })
        );
      })
    );
  });
  