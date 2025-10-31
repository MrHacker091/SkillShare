# 🌐 SkillShare - Deployment Documentation

This guide will help you deploy your SkillShare platform to production using **Vercel** (recommended) or other platforms.

---

## 📋 Table of Contents

1. [Quick Start with Vercel](#quick-start-with-vercel)
2. [Alternative Platforms](#alternative-platforms)
3. [Environment Variables](#environment-variables)
4. [Post-Deployment Setup](#post-deployment-setup)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start with Vercel

**Time Required:** 5-10 minutes

### Why Vercel?
- ✅ Built by Next.js team - perfect compatibility
- ✅ Free tier for personal projects
- ✅ Automatic deployments from GitHub
- ✅ Built-in CDN and serverless functions
- ✅ Zero configuration needed

### Prerequisites
- [x] GitHub account
- [x] Vercel account (sign up at https://vercel.com)
- [x] Your code pushed to GitHub
- [x] Supabase database set up

### Step-by-Step Guide

#### 1️⃣ Test Local Build First

Before deploying, make sure your project builds successfully:

**Windows:**
```bash
.\test-build.bat
```

**Linux/Mac:**
```bash
chmod +x test-build.sh
./test-build.sh
```

**Or manually:**
```bash
cd apps/web
pnpm install
pnpm build
```

✅ If build succeeds, you're ready to deploy!

#### 2️⃣ Push to GitHub

```bash
# If not already initialized
git init

# Add all files
git add .

# Commit
git commit -m "feat: Ready for production deployment"

# Push to GitHub (create repo first on GitHub.com)
git remote add origin https://github.com/YOUR_USERNAME/skillshare.git
git branch -M main
git push -u origin main
```

#### 3️⃣ Deploy to Vercel

**Via Vercel Dashboard:**

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your SkillShare repo
4. Configure settings:
   - **Root Directory:** `apps/web`
   - **Framework:** Next.js (auto-detected)
   - **Build Command:** `pnpm install && pnpm build`
   - **Output Directory:** `.next`
5. Add environment variables (see section below)
6. Click **Deploy**

**Via Vercel CLI (Alternative):**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd apps/web
vercel --prod
```

#### 4️⃣ Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

**Required Variables:**
```
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXTAUTH_SECRET
NEXTAUTH_URL (set to your Vercel URL)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_STORAGE_BUCKET
```

💡 **Tip:** Copy from your local `.env.local` file!

⚠️ **Important:** Update `NEXTAUTH_URL` to your actual Vercel domain after deployment!

#### 5️⃣ Done! 🎉

Your site is live at: `https://your-project-name.vercel.app`

---

## 🔄 Alternative Platforms

### Option 2: Netlify
- Similar to Vercel
- Great for static sites
- **Setup:** Connect GitHub → Auto-deploy
- **Docs:** https://docs.netlify.com/frameworks/next-js/

### Option 3: Railway
- Full-stack platform
- Built-in database option
- **Setup:** Connect GitHub → Deploy
- **Docs:** https://railway.app/

### Option 4: AWS Amplify
- Amazon Web Services
- More control, more complex
- **Setup:** Connect GitHub → Configure build settings
- **Docs:** https://aws.amazon.com/amplify/

### Option 5: Self-Hosted (VPS)
**Platforms:** DigitalOcean, Linode, AWS EC2

**Requirements:**
- Node.js 18+ installed
- PM2 for process management
- Nginx as reverse proxy
- SSL certificate (Let's Encrypt)

**Basic Setup:**
```bash
# On your server
git clone https://github.com/YOUR_USERNAME/skillshare.git
cd skillshare
pnpm install
cd apps/web
pnpm build

# Start with PM2
pm2 start pnpm --name "skillshare" -- start
pm2 save
pm2 startup
```

---

## 🔐 Environment Variables

### Complete List

Copy these from `apps/web/.env.local` to your hosting platform:

```bash
# Database (Required)
DATABASE_URL="postgresql://postgres.xxx:xxx@aws-0-region.pooler.supabase.com:5432/postgres"

# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."

# Authentication (Required)
NEXTAUTH_SECRET="generate-using-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.com"

# OAuth (Required if using Google Sign-In)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# Storage (Required)
NEXT_PUBLIC_STORAGE_BUCKET="skillshare-uploads"

# Payments (Optional - for Stripe integration)
STRIPE_PUBLIC_KEY="pk_live_xxx"
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Email (Optional - for Resend email service)
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

### How to Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## ⚙️ Post-Deployment Setup

After your first deployment, complete these steps:

### 1. Update NEXTAUTH_URL

1. Copy your live URL (e.g., `https://skillshare-xyz.vercel.app`)
2. Update `NEXTAUTH_URL` environment variable in Vercel
3. Redeploy for changes to take effect

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to: **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client
4. Add **Authorized redirect URIs:**
   ```
   https://your-domain.com/api/auth/callback/google
   ```
5. Save changes

### 3. Update Supabase URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to: **Authentication** → **URL Configuration**
4. Update:
   - **Site URL:** `https://your-domain.com`
   - **Redirect URLs:** `https://your-domain.com/**`
5. Save

### 4. Test Everything

Visit your live site and verify:

- ✅ Homepage loads
- ✅ Projects page shows real data
- ✅ Authentication works (sign up/login)
- ✅ API routes respond
- ✅ Database queries work
- ✅ Images display correctly

---

## 🌐 Custom Domain Setup

### Connect Your Own Domain

**Prerequisites:**
- Own a domain (from GoDaddy, Namecheap, etc.)

**Steps:**

1. **In Vercel Dashboard:**
   - Go to: Project → Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `skillshare.com`)

2. **Update DNS Records:**

   Add these records in your domain provider:

   **For root domain (skillshare.com):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS Propagation** (24-48 hours)

4. **Update Environment Variables:**
   - Change `NEXTAUTH_URL` to your custom domain
   - Update Google OAuth redirect URIs
   - Update Supabase allowed URLs

5. **Force HTTPS (Optional but Recommended):**
   - Vercel automatically provisions SSL certificates
   - Enable "Force HTTPS Redirect" in settings

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Cannot find module '@skillshare/database'`

**Solution:**
- Ensure `pnpm-workspace.yaml` is in root
- Verify it includes `packages/*`
- Set **Root Directory** to `apps/web` in Vercel

---

**Error:** `Module not found: Can't resolve 'database'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
```

---

### Database Connection Issues

**Error:** `P1001: Can't reach database server`

**Solution:**
- Check `DATABASE_URL` is correct
- Verify password is URL-encoded (`@` → `%40`)
- Use **Session Pooler** URL (ends with `.pooler.supabase.com`)
- Check Supabase project is running

---

### Authentication Not Working

**Error:** `[next-auth][error][SIGNIN_CALLBACK_ERROR]`

**Solutions:**
1. Verify `NEXTAUTH_URL` matches your domain exactly
2. Check `NEXTAUTH_SECRET` is set and valid
3. Confirm Google OAuth redirect URIs are correct
4. Make sure cookies are enabled in browser

---

### 500 Internal Server Error

**Debug Steps:**

1. **Check Vercel Function Logs:**
   - Vercel Dashboard → Deployments → Click deployment → Function Logs

2. **Common Causes:**
   - Missing environment variables
   - Database connection timeout
   - Invalid Prisma query
   - Missing API route handler

3. **Test API Routes:**
   ```bash
   curl https://your-domain.com/api/projects
   ```

---

### Images Not Loading

**Solutions:**

1. **Add Image Domains to Next.js Config:**

   Edit `apps/web/next.config.ts`:
   ```typescript
   const nextConfig = {
     images: {
       domains: [
         'images.unsplash.com',
         'pqtvdfmdztcrmctsupxb.supabase.co',
         // Add other image CDN domains
       ],
     },
   }
   ```

2. **Use Next.js Image Component:**
   ```tsx
   import Image from 'next/image'
   
   <Image 
     src="/path/to/image.jpg"
     width={400}
     height={300}
     alt="Description"
   />
   ```

---

## 📊 Monitoring & Analytics

### Vercel Analytics

Enable in: Project Settings → Analytics

Features:
- Page views
- Performance metrics (Web Vitals)
- Traffic sources
- Device breakdown

### Error Tracking (Optional)

**Recommended Services:**
- **Sentry:** Real-time error tracking
- **LogRocket:** Session replay + error tracking
- **Datadog:** Full-stack monitoring

**Setup Sentry:**
```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## 🔄 Automatic Deployments

### How It Works

Every push to GitHub triggers:
- ✅ **Main branch** → Production deployment
- ✅ **Other branches** → Preview deployment

### Preview Deployments

Every pull request gets a unique URL for testing:
```
https://skillshare-git-feature-branch-username.vercel.app
```

### Deployment Protection

In Vercel settings, enable:
- **Password Protection** for previews
- **Vercel Authentication** for team projects

---

## 🎯 Performance Optimization

### 1. Enable Edge Functions

For faster API responses worldwide:

In `apps/web/middleware.ts`:
```typescript
export const config = {
  runtime: 'edge',
}
```

### 2. Use ISR (Incremental Static Regeneration)

For projects/creators pages:

```typescript
export const revalidate = 3600 // Revalidate every hour

export default async function ProjectsPage() {
  // ...
}
```

### 3. Optimize Images

Always use Next.js `<Image>` component for automatic optimization.

### 4. Enable Caching

Add cache headers to API routes:

```typescript
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
  }
})
```

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase + Vercel Guide:** https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- **Prisma with Vercel:** https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel

---

## 🎓 Best Practices

1. ✅ Always test builds locally before deploying
2. ✅ Use environment variables for all secrets
3. ✅ Enable automatic deployments for main branch
4. ✅ Use preview deployments for testing features
5. ✅ Set up monitoring and error tracking
6. ✅ Configure custom domain with HTTPS
7. ✅ Regularly update dependencies
8. ✅ Monitor database connection pooling
9. ✅ Implement proper caching strategies
10. ✅ Use Vercel Analytics for insights

---

## 🆘 Need Help?

- **Vercel Discord:** https://vercel.com/discord
- **Next.js Discord:** https://nextjs.org/discord
- **Supabase Discord:** https://discord.supabase.com

---

**Happy Deploying! 🚀**

Made with ❤️ for SkillShare Platform
