#!/bin/bash

set -e

echo "Starting custom Vercel build with Bun..."

# Try to build with Bun
function build_with_bun {
  # Install Bun
  echo "Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL=$HOME/.bun
  export PATH=$BUN_INSTALL/bin:$PATH

  # Verify Bun installation
  echo "Bun version:"
  bun --version

  # Create .npmrc file to ensure optional dependencies are installed
  echo "Creating .npmrc file..."
  cat > .npmrc << EOF
  optional=true
  EOF

  # Install dependencies with Bun
  echo "Installing dependencies with Bun..."
  bun install

  # Prepare Nuxt
  echo "Preparing Nuxt..."
  bun run nuxt prepare

  # Build the application
  echo "Building the application..."
  NITRO_PRESET=vercel bun run build

  # Generate static files
  echo "Generating static files..."
  NITRO_PRESET=vercel bun run generate
}

# Fallback to static site if Bun build fails
function fallback_to_static {
  echo "Falling back to static site..."
  mkdir -p .output/public
  cp -r static-site/* .output/public/
  echo "Static site deployed as fallback."
}

# Try to build with Bun, but fall back to static site if it fails
if ! build_with_bun; then
  echo "Bun build failed, falling back to static site."
  fallback_to_static
else
  echo "Build completed successfully!"
fi 