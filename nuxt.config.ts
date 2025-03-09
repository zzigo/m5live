import { defineNuxtConfig } from 'nuxt/config';

// Helper function to handle GitHub Pages paths
const basePath = process.env.GITHUB_ACTIONS ? '/m5live' : '';

export default defineNuxtConfig({
  experimental: {
    payloadExtraction: false,
    viewTransition: true,
    renderJsonPayloads: true
  },

  ssr: false,

  runtimeConfig: {
    public: {
      apiBase: 'https://m5live.onrender.com/api',
      basePath: basePath
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
    baseURL: process.env.GITHUB_ACTIONS ? '/m5live/' : '/',
    buildAssetsDir: '_nuxt',
    head: {
      title: 'Music V Live',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Music V Live - A web-based implementation of the classic Music V sound synthesis system' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `${basePath}/favicon.ico` },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${basePath}/favicon-32x32.png` },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${basePath}/favicon-16x16.png` },
        { rel: 'apple-touch-icon', sizes: '180x180', href: `${basePath}/apple-touch-icon.png` },
        { rel: 'manifest', href: `${basePath}/manifest.json` }
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
  },

  devtools: { enabled: true }
});