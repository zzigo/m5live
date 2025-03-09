#!/bin/bash

# Exit on error
set -e

echo "Starting fallback build process for Render..."

# Clean environment
echo "Cleaning environment..."
rm -rf node_modules
rm -f package-lock.json

# Create a minimal package.json for the build
echo "Creating minimal package.json..."
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
    "nuxt": "^3.15.1",
    "vue": "^3.5.12"
  }
}
EOF

# Install only essential dependencies
echo "Installing essential dependencies..."
npm install --no-package-lock

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
  }
})
EOF

# Build the application
echo "Building the application..."
NODE_OPTIONS="--max-old-space-size=8192" npm run build

# Generate static files
echo "Generating static files..."
npm run generate

# Restore original files
echo "Restoring original files..."
mv package.json.backup package.json
mv nuxt.config.backup nuxt.config.ts

echo "Fallback build completed successfully!" 