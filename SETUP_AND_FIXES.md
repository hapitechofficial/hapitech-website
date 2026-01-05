# hApItech Website - Setup & Troubleshooting Guide

## Fixed Issues

### 1. Mobile Background Issue
**Problem**: Home page had half black background on mobile
**Solution**: Updated Hero.tsx to properly handle responsive background:
- Added `w-full` class to section
- Ensured animated background shapes don't overflow
- Fixed responsive padding and margins

**File Modified**: `components/Hero.tsx`

### 2. Text Visibility in Auth Forms
**Problem**: Text was same color as background in Google login/signup sections
**Solution**: Enhanced Google OAuth button styling:
- Changed button border from `border-gray-300` to `border-2 border-gray-400`
- Added explicit text color with `<span className="text-charcoal font-medium">`
- Improved hover state background to `hover:bg-gray-100`
- Ensured better contrast and visibility

**Files Modified**: 
- `components/LoginForm.tsx`
- `components/SignupForm.tsx`

### 3. Google OAuth Not Working
**Problem**: Google sign up/login section not functioning
**Solutions Applied**:
- Added `allowDangerousEmailAccountLinking: true` to GoogleProvider config
- Added error handling in signIn callback with try-catch
- Added validation for user.email
- Fixed token handling in session callback
- Added error page callback
- Added JWT and session timeout configuration

**File Modified**: `lib/auth.ts`

## Environment Setup Required

You need to create a `.env.local` file in the root directory with the following credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hapitech"

# NextAuth Configuration (IMPORTANT)
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (REQUIRED for Google login to work)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email Configuration
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@hapitech.com"

# Google Gemini API
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"
```

## Setting Up Google OAuth

### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
7. Copy the Client ID and Client Secret

### Step 2: Add to .env.local
```env
GOOGLE_CLIENT_ID="your-copied-client-id"
GOOGLE_CLIENT_SECRET="your-copied-client-secret"
```

### Step 3: Generate NextAuth Secret
```bash
# Generate a secret key
openssl rand -base64 32
```

Add to `.env.local`:
```env
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"  # or your production URL
```

## Testing the Fixes

### 1. Test Mobile Responsiveness
- Open the website on a mobile device
- The hero section background should be properly colored
- No black areas should appear on the sides

### 2. Test Text Visibility
- Navigate to `/auth/login` or `/auth/signup`
- Check the Google button text is clearly visible (dark gray on white)
- Button should have a visible border and shadow

### 3. Test Google OAuth
1. Click "Continue with Google" button
2. You should be redirected to Google's login page
3. After authentication, you should be redirected to `/tools/poster-generator`
4. Check browser console for any errors

## Common Issues & Solutions

### "Invalid Client ID" Error
- Verify `GOOGLE_CLIENT_ID` in `.env.local`
- Check Google Cloud Console that Client ID matches
- Ensure redirect URI is exactly correct

### "Callback mismatch" Error
- Add the correct callback URL in Google Console
- For localhost: `http://localhost:3000/api/auth/callback/google`
- For production: `https://your-domain.com/api/auth/callback/google`

### Blank Page After Google Login
- Check browser console for errors
- Verify database connection in `DATABASE_URL`
- Check that Prisma migrations are up to date:
  ```bash
  npx prisma migrate deploy
  ```

### Text Still Not Visible
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check browser DevTools to verify CSS is applied

## Database Migration

Ensure your database has the latest schema:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) View database
npx prisma studio
```

## Running the Application

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env.local with the credentials from .env.example

# Run development server
npm run dev

# Open in browser
# http://localhost:3000
```

## Deployment Checklist

- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Use a strong `NEXTAUTH_SECRET`
- [ ] Add production OAuth redirect URI in Google Console
- [ ] Set all production credentials in environment variables
- [ ] Test Google login on production
- [ ] Test on actual mobile devices
- [ ] Verify CSS is properly loaded

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Documentation](https://www.prisma.io/docs/)
