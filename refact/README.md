# M5Live App

A web-based MUSIC V implementation with a vintage terminal aesthetic.

## Features

- MUSIC V score editor with syntax highlighting
- Vintage terminal display with Glass TTY VT220 font
- Function table visualization
- Real-time audio processing

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Generate static site for GitHub Pages
npm run generate
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Initial Setup

Before deploying, update the repository name and GitHub username in all files:

```bash
# Make the script executable
chmod +x update-repo-name.sh

# Run the script with your repository name
./update-repo-name.sh your-repo-name
```

### Automatic Deployment

1. Push changes to the `main` branch
2. GitHub Actions will automatically build and deploy the site
3. Your site will be available at `https://yourusername.github.io/m5live-app/`

### Manual Deployment

You can deploy manually using the provided script:

```bash
# Make sure the script is executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

Or step by step:

```bash
# Generate static site
npm run generate

# Deploy to GitHub Pages
npx gh-pages -d .output/public --dotfiles
```

### Local Preview

To preview the static site locally:

```bash
# Make the script executable
chmod +x serve-static.sh

# Run the script
./serve-static.sh
```

## GitHub Pages Configuration

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set the source to "GitHub Actions"

## Custom Domain (Optional)

1. Uncomment the domain in the `public/CNAME` file
2. Replace with your actual domain
3. Update DNS settings with your domain provider
4. Add the following records:
   - A record: `185.199.108.153`
   - A record: `185.199.109.153`
   - A record: `185.199.110.153`
   - A record: `185.199.111.153`
   - CNAME record: `yourusername.github.io`

## Configuration

The application is configured to work with GitHub Pages by default. If you need to modify the base URL or other settings, check the `nuxt.config.ts` file.

## Font Attribution

This project uses the Glass TTY VT220 font for an authentic vintage terminal look.
