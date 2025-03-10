#!/bin/bash

# Exit on error
set -e

echo "Starting simple build process..."

# Create output directory
mkdir -p .output/public

# Copy static site files
echo "Copying static site files..."
cp -r static-site/* .output/public/

echo "Build completed successfully!" 