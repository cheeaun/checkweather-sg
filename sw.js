importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

workbox.googleAnalytics.initialize();

workbox.routing.registerRoute(
  /\/$/,
  workbox.strategies.networkFirst({
    cacheName: 'index',
  }),
);

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /.*polyfill\.io/,
  workbox.strategies.cacheFirst({
    cacheName: 'polyfill',
  }),
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        purgeOnQuotaError: true,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /.*api\.mapbox\.com\/fonts/,
  workbox.strategies.cacheFirst({
    cacheName: 'mapbox-fonts',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10,
        purgeOnQuotaError: true,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /.*(?:tiles\.mapbox|api\.mapbox)\.com.*$/,
  workbox.strategies.cacheFirst({
    cacheName: 'mapbox',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        purgeOnQuotaError: true,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /.*api\.checkweather/,
  workbox.strategies.networkFirst({
    cacheName: 'api',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
    ],
  }),
);