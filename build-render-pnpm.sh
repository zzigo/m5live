#!/bin/bash

# Exit on error
set -e

echo "Starting pnpm build process for Render..."

# Clean environment
echo "Cleaning environment..."
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml

# Install pnpm
echo "Installing pnpm..."
npm install -g pnpm

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

# Install dependencies with pnpm
echo "Installing dependencies with pnpm..."
PNPM_HOME="/opt/render/.pnpm" PATH="$PNPM_HOME:$PATH" pnpm install --no-optional --shamefully-hoist

# Build the application
echo "Building the application with pnpm..."
NITRO_PRESET=static NODE_OPTIONS="--max-old-space-size=8192" PNPM_HOME="/opt/render/.pnpm" PATH="$PNPM_HOME:$PATH" pnpm run build

# Generate static files
echo "Generating static files..."
PNPM_HOME="/opt/render/.pnpm" PATH="$PNPM_HOME:$PATH" pnpm run generate

# Restore original config
echo "Restoring original config..."
mv nuxt.config.backup nuxt.config.ts

echo "Build completed successfully!" 