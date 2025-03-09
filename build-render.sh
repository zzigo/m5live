#!/bin/bash

# Exit on error
set -e

echo "Starting custom build process for Render using Bun..."

# Clean environment
echo "Cleaning environment..."
rm -rf node_modules
rm -f package-lock.json bun.lockb

# Install dependencies using Bun
echo "Installing dependencies with Bun..."
bun install --no-save

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
  },
  // Disable features that might cause issues
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: false,
    viewTransition: false
  }
});
EOF

# Backup original config
echo "Backing up original Nuxt config..."
cp nuxt.config.ts nuxt.config.original.ts

# Use the temporary config
echo "Using temporary Nuxt config..."
cp nuxt.config.temp.ts nuxt.config.ts

# Build the application using Bun
echo "Building the application with Bun..."
NODE_OPTIONS="--max-old-space-size=8192" bun run nuxt build

# Generate static files
echo "Generating static files..."
bun run nuxt generate

# Restore original config
echo "Restoring original Nuxt config..."
mv nuxt.config.original.ts nuxt.config.ts

echo "Build completed successfully!" 