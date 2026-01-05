# Google OAuth Redirect URI Configuration Guide

## Error: redirect_uri_mismatch

This error occurs when the callback URL that Google's OAuth system receives doesn't match the URLs registered in your Google Cloud Console.

## How to Fix This for Production (hapitech.in)

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID (Web application)

### Step 2: Add Production Redirect URI
In the "Authorized redirect URIs" section, add:

```
https://hapitech.in/api/auth/callback/google
```

### Step 3: Also Keep Development URI (if needed locally)
If you test locally, also add:

```
http://localhost:3000/api/auth/callback/google
```

### Step 4: Save Changes
Click "Save" and wait for changes to propagate (usually instant, but can take a few minutes)

## Verify Your Configuration

### .env.local should have:
```env
NEXTAUTH_URL="https://hapitech.in"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### For local testing:
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## Common Issues

### Issue 1: Mixing HTTP and HTTPS
- Make sure NEXTAUTH_URL matches exactly what you're using
- If using https://hapitech.in, don't use http://hapitech.in

### Issue 2: Trailing Slashes
- The callback URL should NOT have trailing slash
- ✅ Correct: https://hapitech.in/api/auth/callback/google
- ❌ Wrong: https://hapitech.in/api/auth/callback/google/

### Issue 3: Port Numbers
- If using a custom port in development, include it
- ✅ Correct: http://localhost:3000/api/auth/callback/google
- ❌ Wrong: http://localhost/api/auth/callback/google

## Testing Steps

1. **On Production (hapitech.in)**:
   - Go to https://hapitech.in/auth/login
   - Click "Continue with Google"
   - You should be redirected to Google login
   - After authentication, you should be redirected back to the site

2. **Check Browser Console**:
   - If still showing error, open DevTools (F12)
   - Go to Console tab
   - Check for any error messages

3. **Check Network Tab**:
   - In DevTools, go to Network tab
   - Try to sign in with Google
   - Look for the redirect to /api/auth/callback/google
   - Check if it's returning a 200 or error status

## If Still Not Working

1. Clear Google OAuth app cache:
   - Remove and re-add the redirect URI
   - Wait 5 minutes
   - Try again

2. Check NextAuth configuration:
   - Verify NEXTAUTH_URL matches your domain exactly
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct

3. Check server logs:
   - SSH into your production server
   - Check application logs for auth-related errors

## Additional Notes

- The redirect_uri_mismatch error is a security measure by Google
- It ensures OAuth tokens are only sent to authorized domains
- Always use HTTPS in production (never HTTP)
- Keep your GOOGLE_CLIENT_SECRET secure and never commit it to git
