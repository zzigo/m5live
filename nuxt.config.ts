import { defineNuxtConfig } from 'nuxt/config';

// Determine if we're in GitHub Pages environment
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
const baseUrl = isGitHubPages ? '/m5live/' : '/';

export default defineNuxtConfig({
  // Disable SSR completely for GitHub Pages
  ssr: false,

  // Experimental features
  experimental: {
    payloadExtraction: false,
    viewTransition: true,
    renderJsonPayloads: false // Disable JSON payloads which can cause issues on GH Pages
  },

  // Runtime config
  runtimeConfig: {
    public: {
      baseUrl: baseUrl.replace(/\/$/, '') // Remove trailing slash for consistency
    }
  },

  // Nitro configuration
  nitro: {
    preset: 'github-pages'
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
    // Use CDN: false to ensure assets are loaded from relative paths
    cdnURL: '',
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
      prerender: true, // Prerender all routes for static hosting
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
      rollupOptions: {
        output: {
          manualChunks: () => 'everything.js' // Bundle all JS into a single file
        }
      }
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