# Google OAuth Fix - Step by Step for hapitech.in

## The Problem

You're seeing: **"You can't sign in because this app sent an invalid request. Error 400: redirect_uri_mismatch"**

This means the redirect URL that Google is receiving doesn't match what's registered in Google Cloud Console.

---

## Solution: Add Production Redirect URI to Google Cloud Console

### STEP 1: Login to Google Cloud Console

1. Go to https://console.cloud.google.com/
2. Make sure you're logged in with the account that owns the hApItech project
3. Select your hApItech project from the dropdown at the top

### STEP 2: Navigate to OAuth Credentials

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Credentials"** (second item in the menu)
3. Under "OAuth 2.0 Client IDs" section, you should see:
   - **Web application** (this is what you need)
4. Click on the "Web application" entry

### STEP 3: Add the Production Redirect URI

You should now see a popup or page with the OAuth 2.0 Client details.

Look for the section called **"Authorized redirect URIs"**

Add this exact URL:
```
https://hapitech.in/api/auth/callback/google
```

**Important Notes:**
- It MUST start with `https://` (not http)
- It MUST be exactly `https://hapitech.in/api/auth/callback/google`
- NO trailing slash at the end
- Check for typos carefully

### STEP 4: Save the Changes

1. Click the **"Save"** button
2. Wait for the success message
3. **Wait 5-10 minutes** for Google to propagate the change globally

---

## Verify Your Configuration

### Check Your .env.local File

SSH into your production server and verify the .env.local file has:

```bash
cat .env.local
```

Should show:
```env
NEXTAUTH_URL="https://hapitech.in"
NEXTAUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

---

## Test the Fix

### 1. Restart Your Application

```bash
# If using systemd
sudo systemctl restart hapitech

# Or manually:
npm run build
npm start
```

### 2. Test in Incognito Window

This is IMPORTANT because browsers cache OAuth data.

1. Open a **private/incognito** browser window
2. Go to https://hapitech.in/auth/login
3. Click **"Continue with Google"**
4. You should now see Google's login page (not an error)
5. Complete the Google authentication
6. You should be redirected back to your app dashboard

### 3. Check Browser Console

If still having issues:
1. Open DevTools (F12)
2. Go to "Console" tab
3. Try to sign in with Google again
4. Look for error messages
5. Screenshot the error and check the message carefully

---

## Common Mistakes

### ❌ Mistake 1: Wrong URL Format
- ❌ `http://hapitech.in/api/auth/callback/google` (should be HTTPS)
- ❌ `https://hapitech.in/api/auth/callback/google/` (extra slash)
- ❌ `https://www.hapitech.in/api/auth/callback/google` (extra www)
- ✅ Correct: `https://hapitech.in/api/auth/callback/google`

### ❌ Mistake 2: Typos in Client ID/Secret
- Verify they exactly match what's in Google Cloud Console
- Copy-paste instead of typing to avoid mistakes

### ❌ Mistake 3: Missing .env.local on Server
- The server MUST have .env.local file with correct values
- Check: `cat /path/to/app/.env.local`

### ❌ Mistake 4: Cache Issues
- Always test in **private/incognito** window
- Clear cookies: DevTools → Application → Cookies → Clear All
- Browser cache: Ctrl+Shift+Delete

---

## If It Still Doesn't Work

### Check 1: Is the URL exactly right in Google Console?

Open Google Cloud Console and verify:
1. APIs & Services → Credentials
2. Click on your OAuth Client ID
3. Look at "Authorized redirect URIs"
4. Should show: `https://hapitech.in/api/auth/callback/google`

### Check 2: Is NEXTAUTH_URL correct?

SSH to server and check:
```bash
cat .env.local | grep NEXTAUTH_URL
```

Should show:
```
NEXTAUTH_URL=https://hapitech.in
```

(Note: No slash at the end)

### Check 3: Are Client ID/Secret correct?

Compare the values in .env.local with Google Console:
```bash
cat .env.local | grep GOOGLE_CLIENT
```

Go to Google Console and verify they match exactly.

### Check 4: Application Restarted?

Make sure you restarted the app after updating .env.local:
```bash
# Check if app is running
ps aux | grep "node\|npm"

# If yes, stop it (find the PID and kill it)
kill -9 <PID>

# Rebuild and restart
npm run build
npm start
```

---

## Need Help?

If you're still stuck, provide:

1. Screenshot of Google Cloud Console OAuth configuration
2. The exact error message you see
3. Output of: `cat .env.local` (hide sensitive values)
4. Output of: `npm start` (look for error messages)
5. Browser console errors (F12 → Console)

---

## Success Indicators

✅ Google login works
✅ No "redirect_uri_mismatch" error
✅ Redirected to https://hapitech.in/tools/poster-generator after login
✅ User account is created in database
✅ Can see user profile in dashboard

---

That's it! Once you add that redirect URI to Google Cloud Console and wait for propagation, Google OAuth should work perfectly. 🎉
