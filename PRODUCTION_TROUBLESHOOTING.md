# Quick Troubleshooting Guide — Production Issues

## If Credentials Login Still Returns 401

### 1. Check NextAuth Secret
```bash
# Verify these env vars are set:
echo $NEXTAUTH_SECRET
echo $NEXTAUTH_URL
echo $DATABASE_URL
```

If missing, set them:
```bash
NEXTAUTH_SECRET=<generate-new-uuid>
NEXTAUTH_URL=https://www.hapitech.in
DATABASE_URL=postgresql://...
```

### 2. Verify Database Connection
```bash
# In your Next.js server console, check for:
[AUTH] Attempting credentials login for: user@example.com
[AUTH] User authorized successfully: user@example.com
```

If you see:
- `[AUTH] User not found` → Email doesn't exist in DB
- `[AUTH] Password mismatch` → Email exists but password wrong
- No logs → Database query failed (check DATABASE_URL)

### 3. Check User Has Password Set
```sql
-- In your database, verify user has password hash:
SELECT id, email, password FROM "User" WHERE email = 'user@example.com';
```

If `password` is NULL → User was created via Google OAuth, can't login with credentials.

### 4. Verify bcryptjs Installation
```bash
npm list bcryptjs
# Should show: bcryptjs@X.X.X
```

If missing:
```bash
npm install bcryptjs
```

### 5. Check Session/JWT Configuration
Look for in `lib/auth.ts`:
```typescript
session: {
  strategy: "jwt",  // Must be "jwt"
  maxAge: 30 * 24 * 60 * 60,
}
```

---

## If Forgot Password Returns 500

### 1. Check Email Configuration
```bash
# Verify these are set:
echo $EMAIL_USER      # Should be your gmail
echo $EMAIL_PASSWORD  # Should be app-specific password
```

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate app password: https://myaccount.google.com/apppasswords
3. Set `EMAIL_PASSWORD=<app-password>`

### 2. Verify Prisma Schema Has Reset Fields
```bash
# Check in prisma/schema.prisma:
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  resetToken        String?
  resetTokenExpiry  DateTime?
}
```

If missing, run:
```bash
npx prisma migrate dev --name add_reset_token_fields
npx prisma generate
```

### 3. Check Console Logs for Specific Error
Look for `[FORGOT_PW]` logs:
```
[FORGOT_PW] Password reset requested for: user@example.com
[FORGOT_PW] Reset token stored
[FORGOT_PW] Email sent to: user@example.com
```

If email sending fails:
```
[FORGOT_PW] Email send failed (non-blocking): EAUTH
```

This is OK - token was still created. User can retry or check spam folder.

### 4. Verify NEXTAUTH_URL is Correct
```bash
# In forgot-password/route.ts, reset link is:
${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}

# Example:
https://www.hapitech.in/auth/reset-password?token=abc123...
```

If NEXTAUTH_URL is wrong → link won't work.

---

## If Mobile UI Still Looks Bad

### 1. Clear Browser Cache
- Chrome: DevTools > Storage > Clear Site Data
- Mobile Safari: Settings > Safari > Clear History and Website Data

### 2. Check Tailwind CSS is Loaded
In browser DevTools, inspect a form:
```html
<div class="min-h-screen max-md:bg-white dark:max-md:bg-gray-950 ...">
```

Styles should include:
- `max-md:bg-white` (solid white on mobile light mode)
- `dark:max-md:bg-gray-950` (solid dark on mobile dark mode)

If missing → rebuild didn't pick up changes:
```bash
npm run build
```

### 3. Test on Real Mobile Device
Use Chrome DevTools device emulation:
1. Right-click > Inspect
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 / Pixel 5
4. Reload page
5. Check light/dark mode appearance

### 4. Verify Dark Mode is Enabled
Check if dark class is applied:
```bash
# In HTML <html> tag:
<html class="dark" style="color-scheme: dark">
```

If missing, check browser's color-scheme setting.

---

## Common Error Messages & Solutions

### "Invalid email or password"
**Cause:** Either email doesn't exist or password is wrong
**Solution:** 
1. Verify user exists: `SELECT * FROM "User" WHERE email = ?`
2. Verify password is hashed: User should have password field with bcrypt hash
3. Try resetting password via forgot-password flow

### "If an account exists with this email, a password reset link will be sent."
**This is intentional** - we don't reveal if user exists (security)
**Solution:** 
1. Check spam folder for reset email
2. Verify EMAIL_USER/EMAIL_PASSWORD are set
3. Check logs for `[FORGOT_PW]` messages

### "Invalid request body"
**Cause:** JSON parsing failed
**Solution:**
1. Verify request has `Content-Type: application/json`
2. Verify email field is present in JSON
3. Check email is string, not object

### Page looks dark/muddy on mobile dark mode
**Cause:** Old gradient classes still showing
**Solution:**
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Clear cache in DevTools
3. Verify these classes are present:
   - `max-md:bg-white` 
   - `dark:max-md:bg-gray-950`

---

## Testing Endpoints with cURL

### Test Credentials Login
```bash
curl -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "csrfToken": "token"
  }'
```

### Test Forgot Password
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "If an account exists with this email, a password reset link will be sent."
}
```

---

## Logs to Check in Production

### NextAuth Logs
```
[AUTH] Attempting credentials login for: user@example.com
[AUTH] User authorized successfully: user@example.com
[AUTH] Unexpected authorization error: [Error details]
```

### Forgot Password Logs
```
[FORGOT_PW] Password reset requested for: user@example.com
[FORGOT_PW] Reset token stored for: user@example.com
[FORGOT_PW] Email sent to: user@example.com
[FORGOT_PW] Email send failed (non-blocking): [Error]
```

### Looking at Logs on Vercel
```bash
# Stream logs
vercel logs hapitech.in

# Get logs for specific function
vercel logs --follow
```

---

## Deployment Commands

### To Vercel
```bash
# Preview deployment
vercel preview

# Production deployment
vercel --prod

# Check deployment status
vercel status
```

### Local Testing Before Deploy
```bash
# Build
npm run build

# Start production server
npm run start

# Visit http://localhost:3000
```

---

## Quick Win Checklist

- [ ] Verify NEXTAUTH_SECRET is set
- [ ] Verify DATABASE_URL is set
- [ ] Verify user exists with bcrypt password hash
- [ ] Check `[AUTH]` logs when login fails
- [ ] Clear browser cache on mobile
- [ ] Test on device emulator (not just desktop)
- [ ] Verify email config for forgot-password
- [ ] Check console for TypeScript/build errors

---

**Still stuck?** Check the detailed `PRODUCTION_FIXES_APPLIED.md` file for complete technical context.
