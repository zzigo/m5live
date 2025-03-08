<template>
  <div>
    <nav class="nav">
      <NuxtLink to="/" class="nav-link">Home</NuxtLink>
      <NuxtLink to="/editor" class="nav-link">Editor</NuxtLink>
      <NuxtLink to="/about" class="nav-link">About</NuxtLink>
    </nav>
    
    <div v-if="error">
      <h2>Error Occurred</h2>
      <pre>{{ JSON.stringify(error, null, 2) }}</pre>
    </div>
    
    <NuxtPage />
  </div>
</template>

<script setup>
import { onMounted, onErrorCaptured, ref } from 'vue';

const error = ref(null);

// Capture any errors during rendering
onErrorCaptured((err, instance, info) => {
  console.error('Error captured in app.vue:', err);
  error.value = { err, info };
  return false; // prevent error from propagating further
});

onMounted(() => {
  console.log('App mounted');
  
  // Preload the font with correct attributes
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.href = '/fonts/Glass_TTY_VT220.ttf';
  fontPreload.as = 'font';
  fontPreload.type = 'font/ttf';
  fontPreload.crossOrigin = 'anonymous';
  document.head.appendChild(fontPreload);

  // Add a style element to ensure the font is loaded and used
  const fontFaceStyle = document.createElement('style');
  fontFaceStyle.textContent = `
    @font-face {
      font-family: 'Glass TTY VT220';
      src: url('/fonts/Glass_TTY_VT220.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;
  document.head.appendChild(fontFaceStyle);
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #1a1a1a;
  color: #f5f5f5;
}

/* Global font definition */
@font-face {
  font-family: 'Glass TTY VT220';
  src: url('/fonts/Glass_TTY_VT220.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.nav {
  background: #333;
  padding: 1rem;
  margin-bottom: 2rem;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background: #ffb000;
  color: #000;
}

h1, h2, h3 {
  color: #ffb000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
