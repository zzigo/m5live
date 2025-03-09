import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  // Add a global helper to get asset URLs with the correct base path
  nuxtApp.provide('asset', (path: string) => {
    if (path.startsWith('/')) {
      // Remove the leading slash to avoid double slashes
      const cleanPath = path.startsWith('/') ? path.substring(1) : path
      return `${config.public.baseUrl}/${cleanPath}`
    }
    return path
  })
})

// Type declaration for the global helper
declare module '#app' {
  interface NuxtApp {
    $asset: (path: string) => string
  }
}

// Add to Vue prototype for easier access in templates
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $asset: (path: string) => string
  }
} 