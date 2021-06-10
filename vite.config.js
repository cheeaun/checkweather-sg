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
      },
    }),
  ],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
