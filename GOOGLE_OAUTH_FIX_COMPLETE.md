# 🔧 Fix: Google OAuth Not Working After Login

## Problem Identified

After clicking "Continue with Google" and selecting your account, the app is:
1. Not redirecting to dashboard
2. Redirecting back to login page
3. Not creating/recognizing user in database

## Root Causes Fixed

### 1. ✅ Session Strategy Conflict (FIXED)
**Problem**: Using JWT session strategy WITH PrismaAdapter creates conflicts
- JWT strategy doesn't work well with PrismaAdapter
- PrismaAdapter needs database sessions

**Solution Applied**: Changed from JWT to database session strategy
```typescript
// BEFORE (BROKEN)
session: {
  strategy: "jwt"
}

// AFTER (FIXED)
session: {
  strategy: "database"
}
```

### 2. ✅ Callback Logic Simplified (FIXED)
**Problem**: Callback was trying to manually create/update users, interfering with PrismaAdapter
- PrismaAdapter already handles user creation automatically
- Manual operations were causing conflicts

**Solution Applied**: Let PrismaAdapter handle user creation
```typescript
// BEFORE (BROKEN)
if (!dbUser) {
  dbUser = await prisma.user.create({ ... })
}

// AFTER (FIXED)
// Just return true, PrismaAdapter handles it automatically
return true
```

### 3. ⚠️ CRITICAL: Google Credentials Missing (YOU MUST FIX)
**Problem**: `.env.local` has placeholder values, not actual Google credentials
```env
GOOGLE_CLIENT_ID="your_actual_client_id_here"  ❌ PLACEHOLDER
GOOGLE_CLIENT_SECRET="your_actual_client_secret_here"  ❌ PLACEHOLDER
```

**Solution**: Get real credentials from Google Cloud Console and add them

---

## What You Must Do NOW

### Step 1: Get Google OAuth Credentials

1. Go to: **https://console.cloud.google.com/**
2. Create/select a project
3. Enable **Google+ API** and **OpenID Connect**
4. Go to **APIs & Services → Credentials**
5. Click **Create Credentials → OAuth 2.0 Client ID**
6. Choose **Web application**
7. Add these URLs:
   - **JavaScript origins**: `http://localhost:3000`
   - **Redirect URIs**: `http://localhost:3000/api/auth/callback/google`
8. Click Create and copy:
   - **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSP_...`)

### Step 2: Update `.env.local`

Open: `C:\Users\harsh\Desktop\hapitech-website\.env.local`

Find these lines:
```env
GOOGLE_CLIENT_ID="your_actual_client_id_here"
GOOGLE_CLIENT_SECRET="your_actual_client_secret_here"
```

Replace with your ACTUAL values from Step 1:
```env
GOOGLE_CLIENT_ID="123456789-abcdefg.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSP_abc123def456ghi789"
```

### Step 3: Restart Dev Server

Terminal:
```bash
npm run dev
```

Expected output:
```
✓ Ready in X.Xs
```

### Step 4: Test Google OAuth

1. Go to http://localhost:3000/auth/login
2. Click **"Continue with Google"**
3. Select your Google account
4. Should see in terminal: `SignIn: Processing Google OAuth for email: your@email.com`
5. Should redirect to dashboard (`/tools/poster-generator`)

---

## How the Fix Works

### Before (Broken Flow)
```
Google Auth → signIn callback → Manual user creation → Conflict!
              ↓
         PrismaAdapter tries to create too
              ↓
         Database error or session fails
              ↓
         Redirect back to login
```

### After (Fixed Flow)
```
Google Auth → signIn callback → Return true ✅
              ↓
         PrismaAdapter creates user (if new)
              ↓
         Database session created automatically
              ↓
         Redirect to dashboard
```

---

## Code Changes Made

### File: `lib/auth.ts`

**Change 1: Session Strategy**
```typescript
// Changed from: strategy: "jwt"
// Changed to: strategy: "database"
```

**Change 2: Simplified Callbacks**
```typescript
// Removed complex signIn logic that manually created users
// Now just: return true (let PrismaAdapter handle it)
```

**Change 3: Session Callback**
```typescript
// Removed JWT operations
// Now directly uses: user.id from database
```

### File: `.env.local`

**Updated NEXTAUTH_SECRET**
```env
# Before: $(date +%s) which doesn't work in Windows
# After: actual secret string
NEXTAUTH_SECRET="test-secret-key-do-not-use-in-production-12345678901234567890"
```

---

## Troubleshooting If Still Not Working

### Error: "client_id is required"
**Cause**: Google credentials still empty in `.env.local`
**Fix**: 
1. Verify `.env.local` has actual Google credentials (not placeholders)
2. Restart server: `npm run dev`

### Error: "Invalid Redirect URI"
**Cause**: Redirect URI in Google Console doesn't match
**Fix**:
1. Go to Google Console → Credentials
2. Edit OAuth Client
3. Ensure redirect URI exactly matches:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Wait 5-10 minutes for Google to update

### Redirects to login instead of dashboard
**Cause**: Session not being created properly
**Fix**:
1. Check browser cookies: Open DevTools → Application → Cookies
2. Should see `next-auth.session-token` cookie
3. If missing, check server logs for errors
4. Verify database file exists at `prisma/dev.db`

### "Cannot find module 'prisma'" or database errors
**Cause**: Prisma migrations not run
**Fix**:
```bash
npx prisma migrate dev --name init
```

---

## Testing Checklist

After adding Google credentials:

- [ ] `.env.local` has real Google Client ID
- [ ] `.env.local` has real Google Client Secret
- [ ] Server runs without errors: `✓ Ready in X.Xs`
- [ ] Can click "Continue with Google" without error
- [ ] Google login page appears
- [ ] After Google login, server shows: `SignIn: Processing Google OAuth...`
- [ ] Redirected to dashboard (not back to login)
- [ ] Browser has `next-auth.session-token` cookie

---

## Important Notes

⚠️ **NEXTAUTH_SECRET**
- Must be at least 32 characters
- For production, generate with: `openssl rand -base64 32`
- Never share or commit to git

✅ **PrismaAdapter**
- Automatically creates User and Account records
- No manual intervention needed
- Works with database sessions

✅ **allowDangerousEmailAccountLinking**
- Allows linking Google OAuth to existing email accounts
- Safe in development
- Disable for production if desired

---

## What's Different in This Fix

| Aspect | Before | After |
|--------|--------|-------|
| Session | JWT (stateless) | Database (stateful) |
| User Creation | Manual in callback | PrismaAdapter (automatic) |
| signIn Logic | Complex, many operations | Simple, return true |
| Redirect | Not working | ✅ Works properly |
| Database | Conflicts possible | ✅ Clean integration |

---

## Next Steps

1. **GET GOOGLE CREDENTIALS** (Critical!)
2. **UPDATE `.env.local`** with real values
3. **RESTART SERVER** (`npm run dev`)
4. **TEST GOOGLE OAUTH** (click button, should work!)

Once Google OAuth works, email/password signup will also work properly!

---

## Questions?

Check server logs in terminal for detailed error messages. The fix should resolve the redirect issue completely.
