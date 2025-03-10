import { defineNuxtConfig } from 'nuxt/config';

// Determine if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';
// Base URL will be / for Vercel
const baseUrl = '/';

export default defineNuxtConfig({
  // Disable SSR for static site
  ssr: false,

  // Experimental features
  experimental: {
    payloadExtraction: false,
    viewTransition: true,
    renderJsonPayloads: false
  },

  // Runtime config
  runtimeConfig: {
    public: {
      baseUrl: baseUrl.replace(/\/$/, '') // Remove trailing slash for consistency
    }
  },

  // Nitro configuration - use vercel preset for Vercel
  nitro: {
    preset: process.env.NITRO_PRESET || 'node-server'
  },

  // Development server
  devServer: {
    port: 3000
  },

  // Compatibility date
  compatibilityDate: '2025-01-13',

  // App configuration
  app: {
    baseURL: baseUrl,
    buildAssetsDir: '_nuxt',
    head: {
      title: 'Music V Live',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Music V Live - A web-based implementation of the classic Music V sound synthesis system' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: baseUrl + 'favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: baseUrl + 'favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: baseUrl + 'favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: baseUrl + 'apple-touch-icon.png' },
        { rel: 'manifest', href: baseUrl + 'manifest.json' }
      ]
    }
  },

  // Route rules
  routeRules: {
    '/**': { 
      prerender: true,
      cache: {
        maxAge: 60 * 60 * 24 // Cache for 24 hours
      }
    }
  },

  // Vite configuration
  vite: {
    build: {
      assetsInlineLimit: 0, // Don't inline assets as base64
      cssCodeSplit: false, // Generate a single CSS file
    }
  },

  // App config
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

  // Dev tools
  devtools: { enabled: true }
});