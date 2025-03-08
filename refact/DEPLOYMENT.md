# Deployment Guide for GitHub Pages

This document outlines the steps taken to prepare the M5Live app for deployment to GitHub Pages.

## Configuration Changes

1. **Nuxt Configuration**
   - Updated `nuxt.config.ts` to use the `github-pages` preset
   - Set `ssr: false` for static site generation
   - Added dynamic `baseURL` based on repository name
   - Set `buildAssetsDir: 'assets'` to avoid GitHub Pages issues with underscore prefixes

2. **GitHub Actions Workflow**
   - Created `.github/workflows/deploy.yml` for automatic deployment
   - Configured to build and deploy on pushes to the main branch
   - Set to use the `.output/public` directory for deployment
   - Added `enable_jekyll: false` to ensure proper handling of files

3. **Client-Side Routing**
   - Added `404.html` with a script to handle client-side routing
   - Updated `index.html` with a script to handle URL redirects
   - Created `.nojekyll` file to prevent GitHub Pages from processing with Jekyll

4. **Package Scripts**
   - Added `deploy` script to `package.json` for manual deployments
   - Updated to use the correct output directory (`.output/public`)

5. **Helper Scripts**
   - Created `deploy.sh` for easy manual deployment
   - Created `serve-static.sh` for local testing of the static site
   - Created `update-repo-name.sh` to update repository name and username in all files

6. **SEO and Discoverability**
   - Added `robots.txt` for search engine crawling
   - Added `sitemap.xml` for site structure
   - Added `CNAME` file template for custom domain setup

7. **GitHub Templates**
   - Added issue templates for bug reports and feature requests
   - Added pull request template
   - Added GitHub Actions workflow for running tests

## Deployment Process

### Automatic Deployment (Recommended)

1. Update repository name and GitHub username using `./update-repo-name.sh your-repo-name`
2. Push changes to the `main` branch
3. GitHub Actions will automatically build and deploy the site
4. Site will be available at `https://yourusername.github.io/your-repo-name/`

### Manual Deployment

1. Update repository name and GitHub username using `./update-repo-name.sh your-repo-name`
2. Run `./deploy.sh` to generate and deploy the site
3. Site will be available at `https://yourusername.github.io/your-repo-name/`

## Custom Domain (Optional)

1. Uncomment and update the domain in `public/CNAME`
2. Configure DNS settings with your domain provider
3. In GitHub repository settings, add the custom domain

## Local Testing

Run `./serve-static.sh` to generate and serve the static site locally for testing. 