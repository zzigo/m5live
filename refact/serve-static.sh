#!/bin/bash

# Exit on error
set -e

# Check if npx is installed
if ! command -v npx &> /dev/null; then
    echo "npx is not installed. Please install Node.js and npm."
    exit 1
fi

# Generate static site if it doesn't exist
if [ ! -d ".output/public" ]; then
    echo "Static site not found. Generating..."
    npm run generate
fi

# Serve the static site
echo "Serving static site on http://localhost:8080"
npx serve .output/public

