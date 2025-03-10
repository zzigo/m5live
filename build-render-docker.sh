#!/bin/bash

# Exit on error
set -e

echo "Starting Docker-based build process for Render..."

# Create a Dockerfile for the build
echo "Creating Dockerfile..."
cat > Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package.json
COPY package.json ./

# Install dependencies with all optionals
RUN npm install --include=optional

# Install specific esbuild for Linux
RUN npm install @esbuild/linux-x64@0.19.12 --no-save

# Install WebAssembly version of Rollup
RUN npm install @rollup/wasm-node --no-save

# Copy the rest of the application
COPY . .

# Create a simple Nuxt config
RUN cp nuxt.config.ts nuxt.config.backup && \
    echo "export default defineNuxtConfig({" > nuxt.config.ts && \
    echo "  ssr: false," >> nuxt.config.ts && \
    echo "  nitro: { preset: 'static' }," >> nuxt.config.ts && \
    echo "  app: { baseURL: '/' }," >> nuxt.config.ts && \
    echo "  experimental: false," >> nuxt.config.ts && \
    echo "  modules: []," >> nuxt.config.ts && \
    echo "  vite: { build: { minify: false } }" >> nuxt.config.ts && \
    echo "});" >> nuxt.config.ts

# Build the application
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV NITRO_PRESET="static"
RUN npm run build

# Generate static files
RUN npm run generate

# Output directory will be /app/.output/public
EOF

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker to use this build script."
    exit 1
fi

# Build the Docker image
echo "Building Docker image..."
docker build -t m5live-build .

# Create a container and copy the output
echo "Creating container and copying output..."
docker create --name m5live-container m5live-build
rm -rf .output
mkdir -p .output
docker cp m5live-container:/app/.output/public .output/

# Clean up
echo "Cleaning up..."
docker rm m5live-container
docker rmi m5live-build
rm Dockerfile

echo "Build completed successfully! Output is in .output/public" 