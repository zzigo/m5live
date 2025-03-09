#!/bin/bash

# Build the static site
npm run generate

# Check if gh-pages is installed
if ! command -v gh-pages &> /dev/null
then
    echo "gh-pages could not be found, installing..."
    npm install -g gh-pages
fi

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
gh-pages --dotfiles -d .output/public

echo "Deployment complete!" 