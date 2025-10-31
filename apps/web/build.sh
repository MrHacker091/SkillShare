# SkillShare Vercel Build Script

echo "🔧 Starting SkillShare build process..."

# Install all dependencies from root
echo "📦 Installing dependencies..."
cd ../..
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
