#!/bin/bash

# Exit on error
set -e

echo "Starting yarn build process for Render..."

# Clean environment
echo "Cleaning environment..."
rm -rf node_modules
rm -f package-lock.json yarn.lock

# Install yarn
echo "Installing yarn..."
npm install -g yarn

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
  modules: []
})
EOF

# Install dependencies with yarn
echo "Installing dependencies with yarn..."
yarn install --ignore-platform

# Build the application
echo "Building the application with yarn..."
NITRO_PRESET=static NODE_OPTIONS="--max-old-space-size=8192" yarn build

# Generate static files
echo "Generating static files..."
yarn generate

# Restore original config
echo "Restoring original config..."
mv nuxt.config.backup nuxt.config.ts

echo "Build completed successfully!" 