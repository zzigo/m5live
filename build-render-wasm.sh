#!/bin/bash

# Exit on error
set -e

echo "Starting WebAssembly Rollup build process for Render..."

# Clean environment
echo "Cleaning environment..."
rm -rf node_modules
rm -f package-lock.json

# Create a simple Nuxt config
echo "Creating simple Nuxt config..."
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
      target: 'esnext',
      rollupOptions: {
        external: []
      }
    }
  }
})
EOF

# Install WebAssembly version of Rollup
echo "Installing WebAssembly version of Rollup..."
npm install @rollup/wasm-node --no-save

# Install dependencies
echo "Installing dependencies..."
npm install --no-package-lock

# Build the application
echo "Building the application..."
NITRO_PRESET=static NODE_OPTIONS="--max-old-space-size=8192" ROLLUP_WASM_NODE=1 npm run build

# Generate static files
echo "Generating static files..."
npm run generate

# Restore original config
echo "Restoring original config..."
mv nuxt.config.backup nuxt.config.ts

echo "Build completed successfully!" 