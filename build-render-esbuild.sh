#!/bin/bash

# Exit on error
set -e

echo "Starting esbuild-focused build process for Render..."

# Clean environment
echo "Cleaning environment..."
rm -rf node_modules
rm -f package-lock.json

# Create a temporary package.json with explicit esbuild dependencies
echo "Creating temporary package.json with explicit esbuild dependencies..."
cp package.json package.json.backup
cat > package.json << 'EOF'
{
  "name": "nuxt-app",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "generate": "nuxt generate"
  },
  "dependencies": {
    "ace-builds": "^1.37.4",
    "nuxt": "^3.15.1",
    "vue": "^3.5.12",
    "esbuild": "^0.19.12"
  },
  "optionalDependencies": {
    "@esbuild/linux-x64": "^0.19.12",
    "@rollup/rollup-linux-x64-gnu": "4.9.5"
  },
  "overrides": {
    "vite": {
      "rollup": "npm:@rollup/wasm-node"
    },
    "esbuild": "^0.19.12"
  }
}
EOF

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
    optimizeDeps: {
      exclude: ['esbuild']
    },
    build: {
      target: 'esnext',
      minify: false
    }
  }
})
EOF

# Install dependencies with explicit esbuild
echo "Installing dependencies with explicit esbuild..."
npm install --include=optional

# Install WebAssembly version of Rollup
echo "Installing WebAssembly version of Rollup..."
npm install @rollup/wasm-node --no-save

# Build the application
echo "Building the application..."
NITRO_PRESET=static NODE_OPTIONS="--max-old-space-size=8192" ROLLUP_WASM_NODE=1 npm run build

# Generate static files
echo "Generating static files..."
npm run generate

# Restore original files
echo "Restoring original files..."
mv package.json.backup package.json
mv nuxt.config.backup nuxt.config.ts

echo "Build completed successfully!" 