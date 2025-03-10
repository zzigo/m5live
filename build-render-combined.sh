#!/bin/bash

# Exit only on unhandled errors
set +e

echo "Starting combined build process for Render..."

# Try the static-only approach first
echo "Attempting build with static-only approach..."
./build-render-static.sh
STATIC_RESULT=$?

if [ $STATIC_RESULT -eq 0 ]; then
  echo "Static-only build succeeded!"
  exit 0
fi

echo "Static-only build failed with exit code $STATIC_RESULT"

# Check if Docker is available
if command -v docker &> /dev/null; then
  # Try the Docker-based approach
  echo "Attempting build with Docker-based approach..."
  ./build-render-docker.sh
  DOCKER_RESULT=$?

  if [ $DOCKER_RESULT -eq 0 ]; then
    echo "Docker-based build succeeded!"
    exit 0
  fi

  echo "Docker-based build failed with exit code $DOCKER_RESULT"
else
  echo "Docker is not available, skipping Docker-based approach."
fi

# Try the direct approach
echo "Attempting build with direct approach..."
./build-render-direct.sh
DIRECT_RESULT=$?

if [ $DIRECT_RESULT -eq 0 ]; then
  echo "Direct build succeeded!"
  exit 0
fi

echo "Direct build failed with exit code $DIRECT_RESULT"

# Try the esbuild-focused approach
echo "Attempting build with esbuild-focused approach..."
./build-render-esbuild.sh
ESBUILD_RESULT=$?

if [ $ESBUILD_RESULT -eq 0 ]; then
  echo "Esbuild-focused build succeeded!"
  exit 0
fi

echo "Esbuild-focused build failed with exit code $ESBUILD_RESULT"

# Try the WebAssembly Rollup approach
echo "Attempting build with WebAssembly Rollup..."
./build-render-wasm.sh
WASM_RESULT=$?

if [ $WASM_RESULT -eq 0 ]; then
  echo "WebAssembly Rollup build succeeded!"
  exit 0
fi

echo "WebAssembly Rollup build failed with exit code $WASM_RESULT"

# Try the yarn approach
echo "Attempting build with yarn..."
./build-render-yarn.sh
YARN_RESULT=$?

if [ $YARN_RESULT -eq 0 ]; then
  echo "Yarn build succeeded!"
  exit 0
fi

echo "Yarn build failed with exit code $YARN_RESULT"

# Try the Bun-only approach
echo "Attempting build with Bun-only approach..."
./build-render-bun-only.sh
BUN_ONLY_RESULT=$?

if [ $BUN_ONLY_RESULT -eq 0 ]; then
  echo "Bun-only build succeeded!"
  exit 0
fi

echo "Bun-only build failed with exit code $BUN_ONLY_RESULT"

# Try the pnpm approach
echo "Attempting build with pnpm..."
./build-render-pnpm.sh
PNPM_RESULT=$?

if [ $PNPM_RESULT -eq 0 ]; then
  echo "pnpm build succeeded!"
  exit 0
fi

echo "pnpm build failed with exit code $PNPM_RESULT"

# Try the npx approach
echo "Attempting build with npx direct..."
./build-render-npx.sh
NPX_RESULT=$?

if [ $NPX_RESULT -eq 0 ]; then
  echo "npx direct build succeeded!"
  exit 0
fi

echo "npx direct build failed with exit code $NPX_RESULT"

# Try the original fallback approach
echo "Attempting build with original fallback approach..."
./build-render-fallback.sh
FALLBACK_RESULT=$?

if [ $FALLBACK_RESULT -eq 0 ]; then
  echo "Original fallback build succeeded!"
  exit 0
fi

echo "All build approaches failed. Please check the logs for details."
exit 1 