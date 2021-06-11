import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import legacy from '@vitejs/plugin-legacy';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    preact(),
    legacy(),
    VitePWA({
      injectRegister: 'inline',
      strategies: 'injectManifest',
      srcDir: '.',
      filename: 'sw.js',
      manifest: {
        name: 'Check Weather SG',
        short_name: '☀️🌧🇸🇬',
        description: ' Yet another weather app for Singapore',
        display: 'standalone',
        background_color: '#343332',
        theme_color: '#343332',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/maskable-icon.png',
            sizes: '196x196',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: 'screenshots/1.jpg',
            type: 'image/jpg',
            sizes: '640x1136',
          },
          {
            src: 'screenshots/2.jpg',
            type: 'image/jpg',
            sizes: '640x1136',
          },
        ],
        orientation: 'any',
        categories: ['weather', 'rain', 'rainfall', 'singapore', 'map'],
      },
    }),
  ],
  build: {
    sourcemap: true,
    assetsInlineLimit: 0,
    terserOptions: {
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
