# Authentication Troubleshooting Guide

## Issue 1: Google OAuth - Redirecting Back to Login After Clicking Continue

### Problem
After clicking "Continue with Google" and completing Google authentication, you're redirected back to the login page instead of the dashboard.

### Solutions

#### Solution 1: Check Database Connection
The issue is likely that the database couldn't save the user. Check your `.env.local`:

```bash
# Make sure DATABASE_URL is set correctly
cat .env.local | grep DATABASE_URL
```

For production (hapitech.in), this should be your actual database URL, not SQLite.

#### Solution 2: Verify NextAuth Configuration
Make sure your `.env.local` has:
```env
NEXTAUTH_URL="https://hapitech.in"
NEXTAUTH_SECRET="your-secret-here"
GOOGLE_CLIENT_ID="your-id"
GOOGLE_CLIENT_SECRET="your-secret"
DATABASE_URL="your-db-url"
```

#### Solution 3: Rebuild and Restart
```bash
# Stop the current application
# Rebuild
npm run build

# Start fresh
npm start
```

#### Solution 4: Check Server Logs
The server should log: "SignIn: Processing Google OAuth for email: [email]"

If you don't see this, the auth callback isn't being called properly.

### Debug Steps

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Try Google login again**
4. **Check for any JavaScript errors**
5. **Go to Network tab**
6. **Look for request to** `/api/auth/callback/google`
7. **Check the response** - should be 200, not error

---

## Issue 2: Signup Getting Internal Server Error

### Problem
When trying to create a new account, you get an "Internal server error" message.

### Solutions

#### Solution 1: Check Database Connection
The signup requires database access. Verify:
```bash
# Is database running?
# Is connection string correct in .env.local?
cat .env.local | grep DATABASE_URL
```

#### Solution 2: Validate Email Format
Make sure you're using a valid email like:
- ✅ user@example.com
- ✅ john.doe@company.co.uk
- ❌ user@domain (missing TLD)
- ❌ @example.com (missing username)

#### Solution 3: Password Requirements
Password must be:
- ✅ At least 8 characters
- ✅ Can contain any characters
- ❌ Less than 8 characters

#### Solution 4: Email Not Already Used
Check if the email is already registered:
- If you get "User with this email already exists" error, use a different email

#### Solution 5: Check Database Migrations
Make sure migrations are applied:
```bash
npx prisma migrate deploy
```

### Debug Steps

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Try to signup**
4. **Look for error message** - should now say what went wrong (not just "Internal error")
5. **Check network requests** - go to Network tab
6. **Look for request to** `/api/auth/signup`
7. **Click on that request**
8. **Check Response tab** - should show detailed error

---

## Issue 3: Email/Password Login Not Working

### Problem
Email and password login doesn't work, even with a valid account.

### Solutions

#### Solution 1: Verify Account Exists
The account must have been created via signup API or Google OAuth with an emailVerified date.

#### Solution 2: Password Case Sensitivity
Passwords are case-sensitive. Make sure you're typing the exact password.

#### Solution 3: Email Format
Emails are converted to lowercase. These are the same:
- User@Example.com
- user@example.com
- USER@EXAMPLE.COM

#### Solution 4: Check if User Has Password
Google OAuth accounts may not have a password set. Try:
1. Sign in with Google instead
2. Or use email+password signup first

---

## Common Error Messages & Solutions

### "Name, email, and password are required"
- Don't leave any field blank
- Check that all fields have text

### "Password must be at least 8 characters long"
- Create a password with 8+ characters
- Examples: MyPassword1, Test@2024, WeakPassword

### "Invalid email format"
- Email must have format: something@domain.com
- Common mistakes:
  - Missing @: usergmail.com
  - Missing domain: user@
  - Space in email: user @domain.com

### "User with this email already exists"
- The email is already registered
- Either:
  - Sign in with that email instead
  - Use a different email to sign up

### "Passwords do not match"
- The password and confirm password fields must be identical
- Check for typos

### "Invalid email or password"
- Email or password is incorrect
- Make sure you're using the right account
- Password is case-sensitive

### "Network error. Please try again"
- Check your internet connection
- Try again in a few moments
- Check browser console for details

---

## Checking Server Logs

When something goes wrong, check the server logs. They contain detailed error information.

### Local Development (localhost:3000)
Run: `npm run dev`

The console will show:
```
[next-auth][warn] ...
Signup attempt for: user@example.com
Creating user in database...
User created successfully: clxyz123abc
```

Or errors:
```
Signup error: Connection refused on database
```

### Production Server
SSH into server and check:
```bash
# Check application logs
tail -f /var/log/hapitech.log

# Or check running process
pm2 logs hapitech

# Or check systemd logs
journalctl -u hapitech -f
```

---

## Testing the Full Flow

### Test 1: Email/Password Signup
1. Go to https://hapitech.in/auth/signup
2. Enter: Name, Email, Password (8+ chars)
3. Click "Create Account"
4. Should see: "Account created successfully"
5. Should redirect to login page
6. Sign in with that email/password

### Test 2: Email/Password Login
1. Go to https://hapitech.in/auth/login
2. Enter email and password from test above
3. Click "Sign In"
4. Should see dashboard

### Test 3: Google OAuth
1. Go to https://hapitech.in/auth/login
2. Click "Continue with Google"
3. Complete Google authentication
4. Should redirect to dashboard
5. Should see user profile with name

### Test 4: Google OAuth Signup
1. Go to https://hapitech.in/auth/signup
2. Click "Sign up with Google"
3. Complete Google authentication
4. Should redirect to dashboard

---

## If Problems Persist

1. **Clear Browser Cache & Cookies**
   - Ctrl+Shift+Delete
   - Clear all cookies for hapitech.in
   - Clear all cached images/files

2. **Test in Incognito Window**
   - Open new incognito/private window
   - Try signup/login again
   - This avoids browser cache issues

3. **Check Browser Console**
   - F12 → Console tab
   - Look for red error messages
   - Screenshot and review

4. **Enable Debug Logging**
   - Add to .env.local:
   ```env
   DEBUG=next-auth:*
   ```
   - Restart server
   - Check logs for detailed auth flow

5. **Contact Support**
   - Provide:
     - Exact error message
     - Browser console errors
     - Server logs
     - What email you tried
     - Steps you followed

---

## Success Indicators

✅ Signup working: Can create new account
✅ Email/password login working: Can sign in with email
✅ Google OAuth working: Can sign in with Google
✅ Redirecting correctly: Goes to dashboard after login
✅ Session persists: Stays logged in after refresh
