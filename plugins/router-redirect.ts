import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // Only run on client-side
  if (process.server) return
  
  // Get the router
  const router = useRouter()
  
  // Check if we have a path parameter in the URL
  const urlParams = new URLSearchParams(window.location.search)
  const path = urlParams.get('path')
  
  // If we have a path parameter, navigate to it
  if (path) {
    // Remove the path parameter from the URL
    const newUrl = window.location.pathname
    window.history.replaceState({}, '', newUrl)
    
    // Navigate to the path
    router.push(path)
  }
}) 