#!/bin/bash

# Exit only on unhandled errors
set +e

echo "Starting combined build process for Render..."

# Try the Bun-only approach first
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