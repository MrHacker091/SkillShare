# 🚀 Vercel Deployment Checklist

Use this checklist to ensure smooth deployment!

## Pre-Deployment ✅

- [ ] All changes committed to git
- [ ] Code pushed to GitHub
- [ ] Database is seeded with sample data
- [ ] All environment variables are documented
- [ ] `.gitignore` includes `.env*` files
- [ ] Build works locally (`pnpm build`)
- [ ] No TypeScript errors (`pnpm type-check`)

## Vercel Setup ✅

- [ ] Signed up/logged in to Vercel
- [ ] Connected GitHub account
- [ ] Imported SkillShare repository
- [ ] Set **Root Directory** to `apps/web`
- [ ] Added all environment variables (see list below)
- [ ] Clicked "Deploy"

## Environment Variables (12 total) 📝

Copy these from your `.env.local`:

1. [ ] `DATABASE_URL`
2. [ ] `NEXT_PUBLIC_SUPABASE_URL`
3. [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. [ ] `SUPABASE_SERVICE_ROLE_KEY`
5. [ ] `NEXTAUTH_SECRET`
6. [ ] `NEXTAUTH_URL` (⚠️ Update after deployment!)
7. [ ] `GOOGLE_CLIENT_ID`
8. [ ] `GOOGLE_CLIENT_SECRET`
9. [ ] `NEXT_PUBLIC_STORAGE_BUCKET`

## Post-Deployment ✅

- [ ] Copy your live Vercel URL
- [ ] Update `NEXTAUTH_URL` in Vercel environment variables
- [ ] Add Vercel URL to Google OAuth redirect URIs
- [ ] Add Vercel URL to Supabase allowed URLs
- [ ] Redeploy to apply changes
- [ ] Test homepage
- [ ] Test authentication
- [ ] Test database queries
- [ ] Test API routes

## Custom Domain (Optional) 🌐

- [ ] Purchase domain (e.g., from Namecheap, GoDaddy)
- [ ] Add domain in Vercel settings
- [ ] Update DNS records (A, CNAME)
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Update all environment variables with new domain
- [ ] Update OAuth redirect URIs
- [ ] Update Supabase allowed URLs

## Monitoring 📊

- [ ] Check Vercel Analytics
- [ ] Monitor function logs
- [ ] Set up error tracking (optional: Sentry)
- [ ] Enable Vercel Speed Insights

---

## Quick Links 🔗

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/YOUR_USERNAME/skillshare
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Google Cloud Console:** https://console.cloud.google.com

---

## ⚠️ Important Notes

1. **NEXTAUTH_URL must match your domain** - Update it after first deployment!
2. **Database URL must be URL-encoded** - Special characters need %XX encoding
3. **Session Pooler is already configured** - Good for Vercel serverless functions
4. **Every GitHub push triggers automatic deployment** - Be careful with main branch!

---

**Happy Deploying! 🎉**
