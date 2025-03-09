import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  experimental: {
    payloadExtraction: false,
    viewTransition: true,
    renderJsonPayloads: true
  },

  ssr: true,

  runtimeConfig: {
    public: {
      apiBase: 'https://m5live.onrender.com/api'
    }
  },

  nitro: {
    preset: 'node-server'
  },

  devServer: {
    port: 3000
  },

  compatibilityDate: '2025-01-13',

  app: {
    head: {
      meta: [{ name: 'theme-color', content: '#4CAF50' }],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  },

  appConfig: {
    name: 'M5LIVE',
    description: 'LiveCoding version of Pioneer MusicV',
    theme: {
      dark: true,
      colors: {
        primary: '#4CAF50',
        background: '#1a1a1a'
      }
    }
  }
});