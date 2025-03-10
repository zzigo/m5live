#!/bin/bash

# Custom build script for Vercel deployment
# This script handles the EBADF error by using a different build approach

set -e

echo "Starting custom Vercel build script"

# Function to build with Bun (preferred)
build_with_bun() {
  echo "Attempting to build with Bun..."
  
  # Check if Bun is available
  if command -v bun &> /dev/null; then
    echo "Bun is available, installing dependencies..."
    bun install
    
    echo "Building with Bun..."
    NITRO_PRESET=vercel bun run build
    
    # Check if build was successful
    if [ -d ".output" ]; then
      echo "Build with Bun successful!"
      return 0
    else
      echo "Build with Bun failed, falling back to static build"
      return 1
    fi
  else
    echo "Bun is not available"
    return 1
  fi
}

# Function to fall back to static build
fallback_to_static() {
  echo "Falling back to static build..."
  
  # Install dependencies with npm
  npm install
  
  # Create static build configuration
  cat > static.config.js << 'EOF'
export default {
  ssr: false,
  target: 'static',
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  }
}
EOF
  
  # Build with static configuration
  NITRO_PRESET=static NODE_OPTIONS="--max-old-space-size=4096" npm run build
  
  # Check if build was successful
  if [ -d ".output" ]; then
    echo "Static build successful!"
    return 0
  else
    echo "Static build failed"
    return 1
  fi
}

# Try to build with Bun first
if build_with_bun; then
  echo "Build completed successfully with Bun"
else
  # Fall back to static build if Bun fails
  if fallback_to_static; then
    echo "Build completed successfully with static fallback"
  else
    echo "All build attempts failed"
    exit 1
  fi
fi

echo "Build script completed"
exit 0 