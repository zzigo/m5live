import { defineNuxtConfig } from "nuxt/config";

// Get the repository name from environment or default to a placeholder
// This will be used for the base URL in GitHub Pages
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'm5live-app';

export default defineNuxtConfig({
  // Basic configuration
  ssr: false, // Set to false for static site generation
  
  // Set a specific compatibility date
  compatibilityDate: '2024-11-01',
  
  // Enable development tools
  devtools: { enabled: true },
  
  // Set explicit port for development server
  devServer: {
    port: 4000
  },
  
  css: [
    "~/assets/styles/global.css",
  ],
  
  // Runtime configuration
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || "https://m5live.onrender.com/api", // Public backend URL for production
    },
  },
  
  // Nitro configuration for GitHub Pages
  nitro: {
    preset: process.env.GITHUB_ACTIONS ? 'github-pages' : 'node-server',
  },
  
  // Vite configuration
  vite: {
    server: {
      fs: {
        allow: ["node_modules"], // Ensure Vite can access necessary modules
      },
    },
    optimizeDeps: {
      include: ['ace-builds', 'vue3-ace-editor']
    }
  },
  
  // App configuration
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? `/${repository}/` : '/',
    buildAssetsDir: 'assets', // Don't use '_' prefix to avoid GitHub Pages issues
    head: {
      meta: [{ name: "theme-color", content: "#ffb000" }],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/manifest.json" },
      ],
    },
  },
  
  // Build configuration
  build: {
    transpile: ['vue3-ace-editor']
  }
});
