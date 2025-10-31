# Database & System Setup Guide

## 🚨 CRITICAL: Database Not Connected

Your APIs are ready but can't connect to database. Here's what you need:

## 1. DATABASE SETUP (Required for APIs to work)

### Option A: Supabase (Recommended - Free)
1. Go to https://supabase.com/dashboard
2. Create new project (free tier)
3. Go to Settings > Database
4. Copy connection string
5. Add to `.env.local` in root:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres"
```

### Option B: Local PostgreSQL
1. Install PostgreSQL locally
2. Create database: `createdb skillshare`
3. Add to `.env.local`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/skillshare"
```

### Option C: Vercel Postgres (Production)
1. Go to Vercel dashboard
2. Add Vercel Postgres to your project
3. Copy DATABASE_URL from environment variables

## 2. DATABASE MIGRATION & SEED
After setting DATABASE_URL:
```bash
cd packages/database
pnpm prisma migrate dev --name init
pnpm run db:seed
```

## 3. EMAIL SETUP (For Real OTP)
Choose ONE email service:

### Resend (Easiest - Recommended)
```bash
# .env.local
RESEND_API_KEY=re_your_key_here
```
Then uncomment Resend code in `/lib/email.ts`

### Gmail SMTP (Free)
```bash
# .env.local  
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password
```

## 4. AUTHENTICATION STATUS
✅ NextAuth configured
✅ OTP system ready (needs email service)
✅ Role upgrade working
✅ Clean auth flow (no demo dependencies)

## 5. MESSAGES SYSTEM STATUS
✅ UI Components complete
✅ Database schema ready 
⚠️ Real-time WebSocket missing
✅ REST API endpoints ready

## Current Message Capabilities:
- Send messages between users ✅
- View conversation history ✅  
- Mark messages as read ✅
- User-to-user messaging ✅

## Missing for Real-time:
- WebSocket/Socket.IO server
- Real-time message delivery
- Online status indicators
- Typing indicators

## 6. QUICK START CHECKLIST:
1. [ ] Add DATABASE_URL to .env.local
2. [ ] Run: pnpm db:migrate  
3. [ ] Run: pnpm run db:seed
4. [ ] Add email service API key
5. [ ] Uncomment email service in /lib/email.ts
6. [ ] Test registration with real email
7. [ ] Test API endpoints with real data

## 7. WHAT WORKS RIGHT NOW:
✅ Project browsing (with real API + fallback dummy data)
✅ Creator discovery (with real API + fallback dummy data)  
✅ User authentication (NextAuth)
✅ Role upgrades (database-integrated)
✅ Basic messaging (REST API only)
✅ Dashboard navigation
✅ OTP generation (console output only)

## 8. WHAT NEEDS SETUP:
❌ Database connection (DATABASE_URL)
❌ Email service for real OTP delivery
❌ WebSocket server for real-time messaging
❌ Populate database with seed data