# Authentication System - Issues & Solutions

## ✅ What Has Been Fixed

### Dark Mode on Mobile
- ✅ Removed all dark mode styling from login and signup pages
- ✅ Authentication pages now maintain light theme appearance on mobile devices
- ✅ Desktop gradient backgrounds work normally
- ✅ Homepage background stays light even when dark mode is enabled on device

### Database & Migrations
- ✅ Database migrations successfully applied
- ✅ All Prisma models created (User, Account, Session, Subscription, PosterGeneration, Feedback)
- ✅ Build compiles successfully with no errors
- ✅ Ready for deployment

---

## Potential Issues & How to Fix Them

riables Not Set Correctly**
**Problem:** Your `.env.local` has placeholder values and Vercel may not have the correct production values.

**Current Issues in .env.local:**
```
NEXTAUTH_URL=""https://hapitech.in""  ❌ Wrong - has extra quotes
SENDGRID_API_KEY="your_sendgrid_api_key_here"  ❌ Placeholder
STRIPE_SECRET_KEY="your_stripe_secret_key_here"  ❌ Placeholder
```

**Solution (What You Need to Do):**

1. **Fix NEXTAUTH_URL:**
   ```
   NEXTAUTH_URL="https://hapitech.in"
   ```
   (Remove the extra quotes)

2. **Get Real API Keys:**
   - **SendGrid:** Go to sendgrid.com → Settings → API Keys → Create new key
   - **Stripe:** Go to stripe.com → Dashboard → Developers → API Keys → Copy Secret Key
   - **Google OAuth:** Already set in your config

3. **Update Vercel Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add/Update all the keys with real values
   - Redeploy the project

---

### **Issue 3: Google OAuth Configuration Issues**
**Problem:** Google OAuth credentials might be set up for localhost but not for production domain.

**Solution (What You Need to Do):**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Find your OAuth 2.0 Client ID
3. Edit the client and add your domain:
   - **Authorized JavaScript origins:** `https://www.hapitech.in`, `https://hapitech.in`
   - **Authorized redirect URIs:** `https://hapitech.in/api/auth/callback/google`

---

### **Issue 4: Database Connection Issues**
**Problem:** Production database might not be properly connected or initialized.

**Symptoms:**
- 500 error on signup
- "Connection refused" or "ECONNREFUSED"

**Solution (What You Need to Do):**

If using **SQLite** (file-based):
- Ensure database file has write permissions
- Check Vercel serverless function write access

If using **PostgreSQL/MySQL** (recommended for production):
- Update `DATABASE_URL` in production environment variables
- Example PostgreSQL: `postgresql://user:password@host:port/dbname`

---

### **Issue 5: Email Sending Not Working**
**Problem:** SendGrid API key is invalid or not set.

**Symptoms:**
- Password reset emails not received
- Welcome emails not sent

**Solution (What You Need to Do):**

1. Get your SendGrid API key from [https://app.sendgrid.com/settings/api_keys](https://app.sendgrid.com/settings/api_keys)
2. Copy the full key (it starts with `SG.`)
3. Update in Vercel environment variables:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@hapitech.in
   ```

---

### **Issue 6: Session/JWT Issues**
**Problem:** Sessions might not persist correctly between requests.

**Current Config (in lib/auth.ts):**
```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  updateAge: 24 * 60 * 60,
}
```

**This is correct, but ensure:**
- `NEXTAUTH_SECRET` is set and same in all environments
- Your `.env.local` value: `NEXTAUTH_SECRET="test-secr### **Issue 1: Database Not Migrated**
**Problem:** When you deployed, Prisma migrations may not have been applied to the production database.

**Symptoms:**
- 500 error when signing up
- "Feedback API" failing to save data
- Database table doesn't exist

**Solution (What You Need to Do):**

Run this command locally:
```bash
npm run build
npx prisma migrate deploy
```

Or if deploying on Vercel, add this as a build command:
```bash
prisma generate && prisma migrate deploy && next build
```

**Update your package.json:**
```json
"scripts": {
  "build": "prisma generate && prisma migrate deploy && next build",
  "dev": "next dev",
  "start": "next start"
}
```

---

### **Issue 2: Environment Vaet-key-do-not-use-in-production-12345678901234567890"`
  - **⚠️ This should be changed for production!**

**Solution (What You Need to Do):**

Generate a new secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use this new secret in production Vercel environment variables instead of the test secret.

---

### **Issue 7: CORS or Redirect Issues**
**Problem:** After successful login, user might not redirect properly.

**Current Config (in lib/auth.ts):**
```typescript
redirect({ url, baseUrl }) {
  // Always redirect to poster generator after successful signin
  if (url.startsWith("/")) return `${baseUrl}${url}`
  else if (new URL(url).origin === baseUrl) return url
  return `${baseUrl}/tools/poster-generator`
}
```

**This should work, but verify:**
- All URLs use HTTPS (not HTTP)
- No mixed content warnings
- Callback URLs registered in OAuth providers match exactly

---

## Step-by-Step Fix Checklist

### ✅ Local Development (Do These First)
- [ ] Run `npm install` to ensure all packages installed
- [ ] Run `npx prisma migrate dev` to create local database
- [ ] Run `npm run build` to check for build errors
- [ ] Test signup locally at `http://localhost:3000/auth/signup`
- [ ] Test login locally at `http://localhost:3000/auth/login`

### ✅ Production Deployment (Vercel)
- [ ] Update `.env.local` with correct NEXTAUTH_URL (remove extra quotes)
- [ ] Get real API keys for:
  - [ ] SendGrid
  - [ ] Stripe (if using payments)
  - [ ] Generate new NEXTAUTH_SECRET
- [ ] Add all keys to Vercel Environment Variables
- [ ] Update Google OAuth redirect URLs
- [ ] Run `vercel env pull` to sync environment
- [ ] Run build locally: `npm run build`
- [ ] Redeploy: `git push` or `vercel deploy --prod`

### ✅ Post-Deployment Testing
- [ ] Visit https://hapitech.in/auth/signup
- [ ] Try signing up with email
- [ ] Try Google OAuth signup
- [ ] Try logging in
- [ ] Check if user session persists
- [ ] Try password reset (if implemented)

---

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "500 Internal Server Error" on signup | Database not migrated | Run `prisma migrate deploy` |
| "Invalid email or password" on login | User not found | Ensure user was created in signup |
| Google OAuth fails | Redirect URI not registered | Update Google Cloud Console |
| "Connection refused" | Database not accessible | Check DATABASE_URL env variable |
| "Email not sent" | SendGrid key invalid | Update SENDGRID_API_KEY |

---

## Testing Commands

```bash
# Test local signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'

# Test feedback API
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Great service!",
    "rating": 5
  }'
```

---

## Database Troubleshooting

If you're still getting errors, reset the database:

```bash
# Remove local database
rm prisma/dev.db

# Recreate database and run migrations
npx prisma migrate dev

# Seed with test data (optional)
npx prisma db seed
```

---

## Summary

**Dark Mode:** ✅ FIXED - Mobile now shows light theme

**Authentication Issues:** Most are related to:
1. Missing database migrations
2. Invalid/placeholder environment variables
3. Incorrect OAuth configuration

**What to do now:**
1. Follow the "Step-by-Step Fix Checklist" above
2. Ensure all environment variables are correct
3. Run migrations on production
4. Test signup/login functionality
5. If issues persist, check server logs for specific error messages

