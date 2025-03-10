#!/bin/bash

# Exit on error
set -e

echo "Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "Running Vercel deployment..."
vercel --prod

echo "Deployment complete! Check the Vercel dashboard for details."
echo "If you encounter any issues, try the following:"
echo "1. Make sure you're logged in to Vercel (run 'vercel login')"
echo "2. Check that your project is linked to Vercel (run 'vercel link')"
echo "3. Verify that the build scripts in vercel.json are correct"
echo "4. Try deploying with 'vercel --debug' for more information" 