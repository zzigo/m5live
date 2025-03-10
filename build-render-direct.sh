#!/bin/bash

# Exit on error
set -e

echo "Starting direct build process for Render..."

# Clean environment
echo "Cleaning environment..."
rm -rf node_modules
rm -f package-lock.json

# Install only essential dependencies directly
echo "Installing essential dependencies directly..."
npm install esbuild@0.19.12 @esbuild/linux-x64@0.19.12 --no-save
npm install rollup @rollup/wasm-node --no-save
npm install vue@3.5.12 --no-save
npm install nuxt@3.15.1 --no-save

# Create a minimal Nuxt config
echo "Creating minimal Nuxt config..."
cp nuxt.config.ts nuxt.config.backup
cat > nuxt.config.ts << 'EOF'
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: 'static'
  },
  app: {
    baseURL: '/'
  },
  experimental: false,
  modules: [],
  vite: {
    build: {
      minify: false
    }
  }
})
EOF

# Create a simple index page if it doesn't exist
if [ ! -f "pages/index.vue" ]; then
  echo "Creating minimal index page..."
  mkdir -p pages
  cat > pages/index.vue << 'EOF'
<template>
  <div>
    <h1>M5LIVE</h1>
    <p>Music V Live Coding Environment</p>
  </div>
</template>
EOF
fi

# Build directly with Nuxt CLI
echo "Building directly with Nuxt CLI..."
NITRO_PRESET=static NODE_OPTIONS="--max-old-space-size=8192" npx nuxi build

# Generate static files
echo "Generating static files..."
npx nuxi generate

# Restore original config
echo "Restoring original config..."
mv nuxt.config.backup nuxt.config.ts

echo "Build completed successfully!" 