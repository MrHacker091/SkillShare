# 🚀 Vercel Deployment Guide for SkillShare

## Prerequisites ✅

Before deploying to Vercel, make sure:
- ✅ Your code is pushed to GitHub
- ✅ Your Supabase database is set up and running
- ✅ You have all environment variables ready

---

## Step 1: Prepare Your Project 📦

### 1.1 Verify Build Configuration

Your `apps/web/package.json` already has the correct scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",  ← Vercel uses this
    "start": "next start"
  }
}
```

### 1.2 Create Root-Level Vercel Configuration

Since this is a monorepo (pnpm workspace), we need to tell Vercel where the web app is located.

**File:** `vercel.json` (in root directory)
```json
{
  "buildCommand": "cd apps/web && pnpm install && pnpm build",
  "outputDirectory": "apps/web/.next",
  "devCommand": "cd apps/web && pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["sin1"]
}
```

---

## Step 2: Push to GitHub 🐙

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: Initial SkillShare platform commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/skillshare.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel 🎯

### 3.1 Connect Your Repository

1. Go to **https://vercel.com**
2. Sign in with your **GitHub account**
3. Click **"Add New Project"**
4. Click **"Import from GitHub"**
5. Select your **SkillShare repository**

### 3.2 Configure Project Settings

Vercel will auto-detect Next.js. Configure:

**Root Directory:** `apps/web`

**Framework Preset:** Next.js (auto-detected)

**Build Command:** 
```bash
pnpm install && pnpm build
```

**Output Directory:** `.next` (default)

**Install Command:**
```bash
pnpm install
```

### 3.3 Add Environment Variables 🔐

Click on **"Environment Variables"** and add these **ONE BY ONE**:

#### Database
```bash
DATABASE_URL=postgresql://postgres.pqtvdfmdztcrmctsupxb:Ik1436677%40@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres
```

#### Supabase (Public - safe to expose)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://pqtvdfmdztcrmctsupxb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdHZkZm1kenRjcm1jdHN1cHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5OTg1MTUsImV4cCI6MjA1MTU3NDUxNX0.WnOXTRCKfzMVCjErrd0TnShuuNN6k6XNTWWmzMxTQCo
```

#### Supabase (Secret - keep private!)
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdHZkZm1kenRjcm1jdHN1cHhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTk5ODUxNSwiZXhwIjoyMDUxNTc0NTE1fQ.b5FJyvmPoRs8o46YhPt6lWP9WioQ5TQv48Op8Ks_Oyc
```

#### NextAuth Configuration
```bash
NEXTAUTH_SECRET=your-super-secret-jwt-secret-here-change-in-production
NEXTAUTH_URL=https://your-project-name.vercel.app
```

**⚠️ IMPORTANT:** Replace `your-project-name.vercel.app` with your actual Vercel domain after deployment!

#### Google OAuth (if using Google login)
```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

**Note:** Get these from your Google Cloud Console OAuth credentials.

#### File Upload
```bash
NEXT_PUBLIC_STORAGE_BUCKET=skillshare-uploads
```

### 3.4 Deploy! 🚀

Click **"Deploy"** and wait 2-5 minutes.

Vercel will:
1. ✅ Clone your repository
2. ✅ Install dependencies with pnpm
3. ✅ Build your Next.js app
4. ✅ Deploy to global CDN
5. ✅ Give you a live URL: `https://your-project-name.vercel.app`

---

## Step 4: Post-Deployment Configuration 🔧

### 4.1 Update NEXTAUTH_URL

After deployment:

1. Copy your live Vercel URL (e.g., `https://skillshare-xyz.vercel.app`)
2. Go back to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
3. Edit `NEXTAUTH_URL` to your actual domain
4. **Redeploy** for changes to take effect

### 4.2 Update Google OAuth Redirect URIs

If using Google OAuth:

1. Go to **Google Cloud Console** (https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add these **Authorized redirect URIs**:
   ```
   https://your-project-name.vercel.app/api/auth/callback/google
   ```
5. Save

### 4.3 Update Supabase Allowed URLs

1. Go to **Supabase Dashboard** (https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add your Vercel URL to:
   - **Site URL:** `https://your-project-name.vercel.app`
   - **Redirect URLs:** `https://your-project-name.vercel.app/**`

---

## Step 5: Verify Everything Works ✅

Visit your live site and test:

- ✅ Homepage loads
- ✅ Projects page displays data from database
- ✅ Authentication works (sign up/login)
- ✅ API routes respond correctly
- ✅ Images load properly

---

## 🎉 Congratulations!

Your SkillShare platform is now live on Vercel!

### Your Live URLs:
- **Production:** `https://your-project-name.vercel.app`
- **Vercel Dashboard:** `https://vercel.com/dashboard`

---

## Automatic Deployments 🔄

Every time you push to GitHub:
- ✅ **Main branch** → Automatic production deployment
- ✅ **Other branches** → Preview deployments (separate URLs for testing)

---

## Useful Vercel Features 🛠️

### 1. **Preview Deployments**
Every PR gets its own preview URL for testing.

### 2. **Custom Domains**
Add your own domain:
- Go to **Project Settings** → **Domains**
- Add your domain (e.g., `skillshare.com`)
- Update DNS records as instructed

### 3. **Analytics**
Monitor performance:
- Go to **Analytics** tab
- See page views, performance metrics, and more

### 4. **Logs**
Debug issues:
- Go to **Deployments** → Click a deployment → **Function Logs**
- See real-time server logs

---

## Troubleshooting 🔧

### Build Fails?

**Error:** `Cannot find module '@skillshare/database'`
**Solution:** Make sure pnpm workspace is properly configured. Your `pnpm-workspace.yaml` should have:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Error:** `Database connection failed`
**Solution:** Double-check `DATABASE_URL` environment variable is correct and URL-encoded.

### NextAuth Issues?

**Error:** `[next-auth][error][SIGNIN_CALLBACK_ERROR]`
**Solution:** 
1. Make sure `NEXTAUTH_URL` matches your Vercel domain
2. Update Google OAuth redirect URIs
3. Regenerate `NEXTAUTH_SECRET` using: 
   ```bash
   openssl rand -base64 32
   ```

### Slow Performance?

- Enable **Edge Functions** in Vercel settings
- Use Supabase Session Pooler (already configured ✅)
- Enable Next.js **Image Optimization**

---

## Need Help? 🆘

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase + Vercel:** https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

---

**Made with ❤️ for SkillShare Platform**
