#!/bin/bash

# Create source directory if it doesn't exist
mkdir -p src

# Copy Fortran source files
echo "Copying Fortran source files..."
cp ../server/musicV/sources/pass1.f src/
cp ../server/musicV/sources/pass2.f src/
cp ../server/musicV/sources/pass3.f src/

echo "Source files copied successfully!" 