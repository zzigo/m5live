// Define the configuration without imports
// @ts-ignore
const defineNuxtConfig = (config) => config;

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
      baseUrl: '/' // Base URL for Vercel
    }
  },

  // Nitro configuration
  nitro: {
    preset: 'static',
    static: true,
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      ignore: []
    },
    output: {
      publicDir: '.output/public'
    }
  },

  // Development server
  devServer: {
    port: 3001
  },

  // Compatibility date
  compatibilityDate: '2025-01-13',

  // App configuration
  app: {
    baseURL: '/',
    buildAssetsDir: '_nuxt',
    head: {
      title: 'Music V Live',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Music V Live - A web-based implementation of the classic Music V sound synthesis system' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
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
      rollupOptions: {
        output: {
          manualChunks: {
            'ace-editor': ['ace-builds']
          }
        }
      }
    },
    optimizeDeps: {
      exclude: ['fsevents']
    },
    // Add Vue compiler options to suppress the Suspense warning
    vue: {
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => tag === 'Suspense'
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
  devtools: { enabled: false }
});