#!/bin/bash

# Exit on error
set -e

# Check if a repository name was provided
if [ -z "$1" ]; then
    echo "Usage: ./update-repo-name.sh <repository-name>"
    echo "Example: ./update-repo-name.sh my-m5live-app"
    exit 1
fi

REPO_NAME=$1
DEFAULT_NAME="m5live-app"
USERNAME_PLACEHOLDER="yourusername"

# Ask for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "GitHub username is required."
    exit 1
fi

echo "Updating repository name from '$DEFAULT_NAME' to '$REPO_NAME' and username from '$USERNAME_PLACEHOLDER' to '$GITHUB_USERNAME'..."

# Update files
find ./public -type f -name "*.html" -o -name "*.xml" -o -name "robots.txt" | xargs sed -i '' -e "s/$DEFAULT_NAME/$REPO_NAME/g" -e "s/$USERNAME_PLACEHOLDER/$GITHUB_USERNAME/g"

# Update nuxt.config.ts
sed -i '' -e "s/$DEFAULT_NAME/$REPO_NAME/g" ./nuxt.config.ts

# Update README.md
sed -i '' -e "s/$DEFAULT_NAME/$REPO_NAME/g" -e "s/$USERNAME_PLACEHOLDER/$GITHUB_USERNAME/g" ./README.md

echo "Repository name and username updated successfully!" 