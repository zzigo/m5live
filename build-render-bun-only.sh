#!/bin/bash

# Exit on error
set -e

echo "Starting Bun-only build process for Render..."

# Clean environment
echo "Cleaning environment..."
rm -rf node_modules
rm -f package-lock.json bun.lockb

# Ensure Bun is available
echo "Checking Bun version..."
bun --version

# Create a minimal bun.config.js file
echo "Creating bun configuration..."
cat > bunfig.toml << 'EOF'
[install]
production = true
optional = false
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
  modules: []
})
EOF

# Install dependencies with Bun
echo "Installing dependencies with Bun..."
bun install --production --no-optional

# Build the application
echo "Building the application with Bun..."
NITRO_PRESET=static NODE_OPTIONS="--max-old-space-size=8192" bun run nuxt build

# Generate static files
echo "Generating static files..."
bun run nuxt generate

# Restore original config
echo "Restoring original config..."
mv nuxt.config.backup nuxt.config.ts

echo "Build completed successfully!" 