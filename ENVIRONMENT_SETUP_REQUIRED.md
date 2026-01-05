# 🔐 Critical Environment Setup - MUST DO THIS FIRST

## Problem Identified

Your development environment is missing the `.env.local` file with required credentials. This is why:
- ❌ Google OAuth shows `client_id is required`
- ❌ NextAuth JWT sessions are failing
- ❌ Signup/Login forms cannot function

## ✅ Solution - Complete These Steps

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Google+ API
   - OpenID Connect
4. Go to **APIs & Services → Credentials**
5. Click **Create Credentials → OAuth 2.0 Client ID**
6. Choose **Web application**
7. Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://hapitech.in`
8. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://hapitech.in/api/auth/callback/google`
9. Copy your **Client ID** and **Client Secret**

### Step 2: Update `.env.local` in Your Project

Open the `.env.local` file (created in project root) and fill in REAL values:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="use-a-real-secret-key-at-least-32-characters-long"

# Google OAuth - REPLACE WITH YOUR ACTUAL VALUES
GOOGLE_CLIENT_ID="your_actual_client_id_from_google_console"
GOOGLE_CLIENT_SECRET="your_actual_client_secret_from_google_console"

# Email Configuration (Optional for now)
SENDGRID_API_KEY="sk_test_your_sendgrid_key"
SENDGRID_FROM_EMAIL="noreply@hapitech.in"

# Stripe Configuration (Optional for now)
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key"
STRIPE_WEBHOOK_SECRET="whsec_test_webhook_secret"
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

The server will automatically reload when you change `.env.local`.

### Step 4: Test the Fix

1. Go to http://localhost:3000/auth/login
2. Click **"Continue with Google"**
3. Should redirect to Google login (not show error)
4. Should redirect back and show "SignIn: Processing Google OAuth..." in server logs

## 🔑 Where to Find Each Value

| Variable | Where to Get It |
|----------|-----------------|
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials → Your OAuth Client |
| `GOOGLE_CLIENT_SECRET` | Same location as above |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
| `SENDGRID_API_KEY` | SendGrid account → Settings → API Keys |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |

## ⚠️ Important Notes

- **NEVER commit `.env.local` to Git** (it's already in .gitignore)
- `NEXTAUTH_SECRET` must be **at least 32 characters long** in production
- For production at https://hapitech.in, update `.env` with production URLs
- Credentials should NOT contain quotes or spaces

## ✅ Verification Checklist

After setting up:

- [ ] `.env.local` file exists in project root
- [ ] `GOOGLE_CLIENT_ID` is filled with actual value (starts with numbers and .apps.googleusercontent.com)
- [ ] `GOOGLE_CLIENT_SECRET` is filled with actual value
- [ ] `NEXTAUTH_SECRET` is at least 32 characters
- [ ] Server logs show "Ready in X.Xs" without "[next-auth][warn]" messages
- [ ] Google button click redirects to Google (not error page)
- [ ] Signup form submits without "client_id is required" error

## 🆘 Still Having Issues?

Run this command to check environment variables are loaded:
```bash
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.GOOGLE_CLIENT_ID)"
```

Should print your actual Google Client ID (not undefined).
