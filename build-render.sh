#!/bin/bash

# Exit on error
set -e

echo "Starting custom build process for Render..."

# Clean environment
echo "Cleaning environment..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies without running scripts
echo "Installing dependencies..."
RENDER=true npm install --no-package-lock --no-optional

# Explicitly install the Linux Rollup binary
echo "Installing Rollup Linux binary..."
npm install @rollup/rollup-linux-x64-gnu --no-save

# Create a simple Nuxt config for the build
echo "Creating temporary Nuxt config..."
cat > nuxt.config.temp.ts << 'EOF'
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  ssr: false,
  nitro: {
    preset: 'static'
  },
  app: {
    baseURL: '/'
  }
});
EOF

# Backup original config
echo "Backing up original Nuxt config..."
cp nuxt.config.ts nuxt.config.original.ts

# Use the temporary config
echo "Using temporary Nuxt config..."
cp nuxt.config.temp.ts nuxt.config.ts

# Build the application
echo "Building the application..."
NODE_OPTIONS="--max-old-space-size=4096" npx nuxt build

# Generate static files
echo "Generating static files..."
npx nuxt generate

# Restore original config
echo "Restoring original Nuxt config..."
mv nuxt.config.original.ts nuxt.config.ts

echo "Build completed successfully!" 