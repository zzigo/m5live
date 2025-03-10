#!/bin/bash

# Exit on error
set -e

echo "Preparing for Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete! Your site should be available on Vercel."
echo "If this is your first deployment, you may need to link your GitHub repository to Vercel."
echo "Visit https://vercel.com/dashboard to manage your deployments." 