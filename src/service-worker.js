//src/service-worker.js
import { precacheAndRoute } from 'workbox-precaching';

// Precache assets injected by Workbox
precacheAndRoute(self.__WB_MANIFEST);

// Define cache names
const PRECACHE = 'next-pwa-v2'; // Updated version
const RUNTIME = 'royal-static-v2'; // Updated version
const OFFLINE_URL = '/offline.html';

// Assets to manually cache
const STATIC_ASSETS = [
  '/',
  OFFLINE_URL,
  '/favicon.ico',
  '/manifest.json',
];

// Install event: cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(RUNTIME).then(cache => {
      return Promise.all(
        STATIC_ASSETS.map(async asset => {
          try {
            await cache.add(asset);
            console.log(`✅ Cached: ${asset}`);
          } catch (err) {
            console.warn(`❌ Failed to cache ${asset}:`, err);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker installed successfully');
      return self.skipWaiting(); // Force activation
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => ![PRECACHE, RUNTIME].includes(key))
          .map(key => {
            console.log(`Deleting old cache: ${key}`);
            return caches.delete(key);
          })
      );
    }).then(() => {
      console.log('Service Worker activated successfully');
      return self.clients.claim(); // Take control immediately
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip unsupported schemes
  if (!request.url.startsWith('http') && !request.url.startsWith('https')) {
    console.warn('⛔ Skipping unsupported request:', request.url);
    return;
  }

  // Handle images with cache-first strategy
  if (request.destination === 'image') {
    const cleanUrl = request.url.split('?')[0];
    const cleanRequest = new Request(cleanUrl, {
      method: 'GET',
      headers: request.headers,
      mode: request.mode === 'navigate' ? 'cors' : request.mode,
      credentials: request.credentials,
      redirect: request.redirect,
    });

    event.respondWith(
      caches.match(cleanRequest, { ignoreSearch: true }).then(cachedResponse => {
        if (cachedResponse) {
          console.log('✅ Serving cached image:', cleanUrl);
          return cachedResponse;
        }

        return fetch(request).then(response => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(RUNTIME).then(cache => cache.put(cleanRequest, cloned));
          }
          return response;
        }).catch(() => {
          console.warn('⚠️ Image fetch failed:', cleanUrl);
          return new Response('Image not available offline', { 
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
    );
    return;
  }

  // Handle HTML requests with network-first strategy
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(RUNTIME).then(cache => cache.put(request, cloned));
        }
        return response;
      }).catch(() => {
        console.log(`HTML fetch failed, trying cache for: ${request.url}`);
        return caches.match(request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to offline page
          return caches.match(OFFLINE_URL);
        });
      })
    );
    return;
  }

  // Handle other requests (CSS, JS, etc.) with cache-first strategy
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('✅ Serving cached resource:', request.url);
        return cachedResponse;
      }
      
      return fetch(request).then(response => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(RUNTIME).then(cache => cache.put(request, cloned));
        }
        return response;
      }).catch(() => {
        console.log(`Request failed and no cache available for: ${request.url}`);
        return new Response('Offline - Resource not available', { 
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});

// Push notification handler
self.addEventListener('push', event => {
  const data = event.data?.json() || {};

  const title = data.title || 'New Notification';
  const options = {
    body: data.body || 'You have a new message',
    icon: data.icon || '/logo_icons/android/res/mipmap-xxxhdpi/ic_launcher.png',
    badge: data.badge || '/logo_icons/android/res/mipmap-xxxhdpi/ic_launcher.png',
    data: data.data || {},
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = event.notification?.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});