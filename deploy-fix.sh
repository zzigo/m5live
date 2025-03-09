#!/bin/bash

# Make sure the .github/workflows directory exists
mkdir -p .github/workflows

# Copy the updated workflow file
cat > .github/workflows/nuxt.yml << 'EOF'
# Sample workflow for building and deploying a Nuxt site to GitHub Pages
#
# To get started with Nuxt see: https://nuxtjs.org/docs/get-started/installation
#
name: Deploy Nuxt site to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["master"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Detect package manager
        id: detect-package-manager
        run: |
          if [ -f "${{ github.workspace }}/yarn.lock" ]; then
            echo "manager=yarn" >> $GITHUB_OUTPUT
            echo "command=install" >> $GITHUB_OUTPUT
            exit 0
          elif [ -f "${{ github.workspace }}/package.json" ]; then
            echo "manager=npm" >> $GITHUB_OUTPUT
            echo "command=ci" >> $GITHUB_OUTPUT
            exit 0
          else
            echo "Unable to determine package manager"
            exit 1
          fi
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: ${{ steps.detect-package-manager.outputs.manager }}
      - name: Setup Pages
        uses: actions/configure-pages@v5
        with:
          # Automatically inject router.base in your Nuxt configuration file and set
          # target to static (https://nuxtjs.org/docs/configuration-glossary/configuration-target/).
          #
          # You may remove this line if you want to manage the configuration yourself.
          static_site_generator: nuxt
      - name: Restore cache
        uses: actions/cache@v4
        with:
          path: |
            .output
            .nuxt
          key: ${{ runner.os }}-nuxt-build-${{ hashFiles('.output') }}
          restore-keys: |
            ${{ runner.os }}-nuxt-build-
      - name: Install dependencies
        run: ${{ steps.detect-package-manager.outputs.manager }} ${{ steps.detect-package-manager.outputs.command }}
      - name: Static HTML export with Nuxt
        run: ${{ steps.detect-package-manager.outputs.manager }} run generate
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./.output/public

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF

# Make the script executable
chmod +x .github/workflows/nuxt.yml

echo "Workflow file updated. Now commit and push to GitHub:"
echo "git add .github/workflows/nuxt.yml"
echo "git commit -m 'Fix GitHub Pages deployment workflow for Nuxt 3'"
echo "git push origin master" 