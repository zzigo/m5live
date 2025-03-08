#!/bin/bash

# Exit on error
set -e

# Generate static site
echo "Generating static site..."
npm run generate

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d .output/public --dotfiles

echo "Deployment complete!" 