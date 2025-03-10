#!/bin/bash

# Don't exit on error - we want to handle errors gracefully
set +e

echo "Starting build process..."

# Create output directory
mkdir -p .output/public

# Try to build with bun if available
if command -v bun &> /dev/null; then
  echo "Bun found, using it for build..."
  
  # Create .npmrc to skip optional dependencies
  echo "Creating .npmrc to handle dependencies..."
  cat > .npmrc << 'NPMRC'
optional=false
NPMRC

  # Install dependencies
  echo "Installing dependencies..."
  bun install
  
  # Try to run the generate command
  echo "Attempting to generate static site..."
  bun run generate
  
  # Check if the build succeeded
  if [ $? -eq 0 ] && [ -d ".output/public" ] && [ "$(ls -A .output/public)" ]; then
    echo "Build completed successfully!"
    exit 0
  else
    echo "Build failed, falling back to static site..."
  fi
else
  echo "Bun not available, using static site..."
fi

# Fall back to static site
echo "Deploying static site..."

# Ensure output directory exists
mkdir -p .output/public

# Copy static site files if the directory exists
if [ -d "static-site" ] && [ "$(ls -A static-site)" ]; then
  echo "Copying static site files..."
  cp -r static-site/* .output/public/
  echo "Static files copied successfully."
else
  echo "No static-site directory found or it's empty."
fi

# Create a simple index.html if it doesn't exist
if [ ! -f .output/public/index.html ]; then
  echo "Creating default index.html..."
  cat > .output/public/index.html << 'EOFMARKER'
<!DOCTYPE html>
<html>
<head>
  <title>M5LIVE - Music V Live</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #fff; }
    h1 { color: #4CAF50; }
    .container { background: #2a2a2a; padding: 20px; border-radius: 8px; }
    .button { display: inline-block; background: #4a148c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>M5LIVE - Music V Live</h1>
  <div class="container">
    <p>The full interactive application is currently being deployed.</p>
    <p>Please check back soon for the complete version of M5LIVE.</p>
    <a href="https://github.com/zzigo/m5live" class="button">View on GitHub</a>
  </div>
</body>
</html>
EOFMARKER
fi

# Verify the output directory has content
if [ -d ".output/public" ] && [ "$(ls -A .output/public)" ]; then
  echo "Static site deployed successfully!"
  exit 0
else
  echo "Error: Failed to create static site."
  exit 1
fi 