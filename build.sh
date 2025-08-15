#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting build process..."

# Build shell app
echo "📦 Building shell app..."
npm run build

# Build home microfrontend
echo "🏠 Building home microfrontend..."
cd microfrontends/home
npm install
npm run build
cd ../..

# Build NovaTrace microfrontend
echo "🔬 Building NovaTrace microfrontend..."
cd microfrontends/novatrace
npm install
npm run build
cd ../..

# Copy microfrontend builds to shell dist
echo "📋 Copying microfrontend builds..."
mkdir -p dist/home dist/novatrace
cp -r microfrontends/home/dist/* dist/home/
cp -r microfrontends/novatrace/dist/* dist/novatrace/

echo "✅ Build completed successfully!"
