# Email Service Setup Guide

## 🚨 IMPORTANT: OTP emails are currently CONSOLE LOGGING ONLY

Your OTP system is ready but needs ONE email service to be configured:

## Option 1: Resend (Recommended - Easiest)
1. Sign up at https://resend.com (Free tier: 3,000 emails/month)
2. Get API key from dashboard
3. Add to .env.local:
```
RESEND_API_KEY=re_your_api_key_here
```

## Option 2: SendGrid
1. Sign up at https://sendgrid.com (Free tier: 100 emails/day)
2. Create API key with "Mail Send" permissions
3. Add to .env.local:
```
SENDGRID_API_KEY=SG.your_api_key_here
```

## Option 3: Gmail SMTP (Free)
1. Enable 2FA on your Gmail account
2. Generate App Password (not regular password)
3. Add to .env.local:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com  
SMTP_PASS=your_app_password_here
```

## Then Enable Email in Code:
Uncomment the service you chose in `/lib/email.ts` (lines 212-245)

## Test Setup:
1. Add environment variables
2. Uncomment chosen service code
3. Try registering with your email
4. Check your inbox for OTP!