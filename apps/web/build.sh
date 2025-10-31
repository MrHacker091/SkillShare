#!/bin/bash
set -e

echo "🔧 Starting SkillShare build process..."

# Go to root directory
cd ../..

# Install all dependencies
echo "📦 Installing dependencies..."
pnpm install --no-frozen-lockfile

# Generate Prisma Client
echo "🔨 Generating Prisma Client..."
cd packages/database
pnpm prisma generate

# Build the web app
echo "🏗️ Building Next.js app..."
cd ../../apps/web
pnpm build

echo "✅ Build complete!"
