#!/bin/bash
# Test Production Build Locally

echo "🧪 Testing Production Build..."
echo ""

# Step 1: Clean previous builds
echo "📦 Cleaning previous builds..."
rm -rf apps/web/.next
rm -rf apps/web/out

# Step 2: Install dependencies
echo "📥 Installing dependencies..."
pnpm install

# Step 3: Build the project
echo "🔨 Building Next.js app..."
cd apps/web
pnpm build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "🚀 To test production build locally, run:"
    echo "   cd apps/web && pnpm start"
    echo ""
    echo "Then open: http://localhost:3000"
else
    echo ""
    echo "❌ Build failed! Check the errors above."
    echo ""
    echo "Common issues:"
    echo "  - TypeScript errors → Run: pnpm type-check"
    echo "  - Missing dependencies → Run: pnpm install"
    echo "  - Database connection → Check DATABASE_URL in .env.local"
fi
