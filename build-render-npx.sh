#!/bin/bash

# Exit on error
set -e

echo "Starting npx direct build process for Render..."

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
  modules: []
})
EOF

# Install only nuxt
echo "Installing only Nuxt..."
npm install nuxt@3.15.1 --no-save

# Build directly with npx
echo "Building directly with npx..."
NITRO_PRESET=static NODE_OPTIONS="--max-old-space-size=8192" npx nuxi build

# Generate static files
echo "Generating static files..."
npx nuxi generate

# Restore original config
echo "Restoring original config..."
mv nuxt.config.backup nuxt.config.ts

echo "Build completed successfully!" 