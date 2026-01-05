# 🚀 Complete Setup Guide - Fix All Issues

## Summary of What We Fixed

✅ **Fixed Code Issues:**
1. Added `NEXTAUTH_SECRET` configuration to `lib/auth.ts` (line 9)
2. Created `.env.local` file with placeholder values
3. Server now loads environment configuration correctly

⚠️ **What YOU Must Do:**

## Step-by-Step Setup

### 1️⃣ Get Google OAuth Credentials (5 minutes)

**Go to:** https://console.cloud.google.com/

1. **Create/Select Project**
   - Click project dropdown at top
   - Click "NEW PROJECT"
   - Name: "hapitech" → Click Create

2. **Enable APIs**
   - Search bar → Search "Google+ API" → Click → Enable
   - Search "OpenID Connect" → Click → Enable

3. **Create OAuth 2.0 Credentials**
   - Left sidebar → APIs & Services → Credentials
   - Click **"+ Create Credentials"** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: "hapitech-dev"
   
4. **Add Authorized URLs**
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://hapitech.in
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/api/auth/callback/google
     https://hapitech.in/api/auth/callback/google
     ```
   - Click Create

5. **Copy Your Credentials**
   - You'll see a popup with:
     - **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
     - **Client secret** (looks like: `GOCSP_abc123...`)
   - Keep these safe!

### 2️⃣ Update `.env.local` File (2 minutes)

File location: `C:\Users\harsh\Desktop\hapitech-website\.env.local`

**Replace ONLY these two lines with your Google values:**

```env
GOOGLE_CLIENT_ID="your_actual_client_id_from_step_1_5"
GOOGLE_CLIENT_SECRET="your_actual_client_secret_from_step_1_5"
```

**Example (DO NOT USE - just for reference):**
```env
GOOGLE_CLIENT_ID="12345678-abcdefgh.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSP_abc123def456ghi789"
```

✅ **Keep everything else in `.env.local` as is** (no changes needed)

### 3️⃣ Restart Development Server (1 minute)

Terminal command:
```bash
npm run dev
```

Should see:
```
✓ Ready in X.Xs
```

**NO errors about `[next-auth][warn]` or `client_id is required`** ✅

### 4️⃣ Test Google OAuth Login (2 minutes)

1. Open http://localhost:3000/auth/login
2. Click **"Continue with Google"**
3. Should see Google login page
4. Log in with your Google account
5. Should see dashboard redirect OR database-related error (that's normal if DB isn't set up)

**Success indicators in server logs:**
```
SignIn: Processing Google OAuth for email: your@email.com
SignIn: Creating new user from Google OAuth
SignIn: User created successfully: clxxxxxxxxxxxxx
```

### 5️⃣ Test Email/Password Signup (2 minutes)

1. Go to http://localhost:3000/auth/signup
2. Try creating account with:
   - Name: Test User
   - Email: test@example.com
   - Password: TestPassword123
   - Confirm Password: TestPassword123
3. Click Sign Up

**Expected behavior:**
- ✅ User created successfully, redirected to login
- ❌ "Email already exists" - if you try same email twice
- ❌ "Password must be at least 8 characters" - if password too short

### 6️⃣ Test Email/Password Login (1 minute)

1. Go to http://localhost:3000/auth/login
2. Enter email and password from step 5
3. Click Sign In
4. Should redirect to dashboard

## Troubleshooting

### Error: "client_id is required"
**Cause:** Google credentials missing from `.env.local`
**Fix:** 
1. Check `.env.local` file exists
2. Paste actual `GOOGLE_CLIENT_ID` value (from Google Console)
3. Restart server with `npm run dev`

### Error: "Invalid email or password"
**Cause:** Email/password doesn't match database
**Fix:**
1. Ensure you created account via signup first
2. Use exact same email you signed up with
3. Check email is lowercase

### Google redirects to error page
**Cause 1:** Redirect URI not in Google Console
**Fix:** Add both URLs to Google Console:
- `http://localhost:3000/api/auth/callback/google`
- `https://hapitech.in/api/auth/callback/google`

**Cause 2:** 5+ minute cache - Google takes time to update
**Fix:** Wait 5-10 minutes, clear browser cookies, try again

### Server shows "[next-auth][warn][NO_SECRET]"
**Cause:** `NEXTAUTH_SECRET` missing or empty
**Fix:** Ensure `.env.local` has:
```env
NEXTAUTH_SECRET="use-a-real-secret-key-at-least-32-characters-long"
```

### Database error on signup
**Cause:** SQLite database file missing or permission issue
**Fix:** 
1. Ensure `prisma/schema.prisma` has `provider = "sqlite"`
2. Run `npx prisma migrate dev --name init` to create database
3. Check write permissions on `prisma/dev.db` file

## Production Setup (After Testing Dev)

When deploying to https://hapitech.in, update your hosting provider's environment variables:

```env
NEXTAUTH_URL="https://hapitech.in"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
NEXTAUTH_SECRET="generate-new-secret-$(openssl rand -base64 32)"
DATABASE_URL="your_production_database_url"
```

## ✅ Final Verification Checklist

- [ ] `.env.local` file exists in project root
- [ ] `GOOGLE_CLIENT_ID` filled with value from Google Console
- [ ] `GOOGLE_CLIENT_SECRET` filled with value from Google Console
- [ ] `NEXTAUTH_SECRET` is at least 32 characters
- [ ] Server shows "✓ Ready in X.Xs" without warnings
- [ ] Can click "Continue with Google" and see Google login page
- [ ] Can create new account via email/password signup
- [ ] Can log in with created email/password account
- [ ] Server logs show successful auth operations

## 📞 Need Help?

Check server logs for exact error messages - they'll guide you to the solution.

Current server logs available at: http://localhost:3000 (console in terminal)
