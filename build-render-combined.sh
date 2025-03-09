#!/bin/bash

# Exit only on unhandled errors
set +e

echo "Starting combined build process for Render..."

# Try the Bun approach first
echo "Attempting build with Bun..."
./build-render.sh
BUN_RESULT=$?

# If Bun approach failed, try the fallback approach
if [ $BUN_RESULT -ne 0 ]; then
  echo "Bun build failed with exit code $BUN_RESULT"
  echo "Trying fallback approach..."
  ./build-render-fallback.sh
  FALLBACK_RESULT=$?
  
  if [ $FALLBACK_RESULT -ne 0 ]; then
    echo "Fallback build also failed with exit code $FALLBACK_RESULT"
    echo "Both build approaches failed. Please check the logs for details."
    exit 1
  else
    echo "Fallback build succeeded!"
    exit 0
  fi
else
  echo "Bun build succeeded!"
  exit 0
fi 