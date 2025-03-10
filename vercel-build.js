#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment variables
process.env.NITRO_PRESET = 'vercel';
process.env.ROLLUP_WASM_NODE = '1';

console.log('Starting custom Vercel build script...');

try {
  // Install WebAssembly version of Rollup and Linux esbuild
  console.log('Installing WebAssembly version of Rollup and Linux esbuild...');
  execSync('npm install @rollup/wasm-node @esbuild/linux-x64 --no-save', { stdio: 'inherit' });

  // Create a simple .npmrc file to ensure optional dependencies are installed
  console.log('Creating .npmrc file...');
  fs.writeFileSync('.npmrc', 'omit=dev\noptional=true\n');

  // Run nuxt prepare
  console.log('Running nuxt prepare...');
  execSync('npx nuxt prepare', { stdio: 'inherit' });

  // Generate static files
  console.log('Generating static files...');
  execSync('npx nuxt generate', { stdio: 'inherit' });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 