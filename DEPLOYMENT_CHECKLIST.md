# Production Deployment Checklist - hapitech.in

## Pre-Deployment ✅

### Code Quality
- [x] All files built successfully (0 errors)
- [x] All 33 routes compiled
- [x] TypeScript validation passed
- [x] No console warnings (except deprecated middleware - harmless)
- [x] Dark mode support implemented
- [x] Error handling comprehensive
- [x] Authentication working with JWT

### Testing
- [x] Dev server running without errors
- [x] All API endpoints have proper error handling
- [x] Protected routes validate tokens
- [x] Form validation working
- [x] Email validation working

---

## Deployment Steps for Backend Team

### Step 1: Environment Setup
```bash
# SSH into production server
ssh your-production-server.com

# Navigate to project directory
cd /path/to/hapitech-website

# Set environment variables (choose one method)

# Method A: Using .env file
cat > .env.production << EOF
NEXTAUTH_SECRET=your-long-secret-key-here
NEXTAUTH_URL=https://hapitech.in
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
STRIPE_SECRET_KEY=sk_live_your-stripe-key
STRIPE_MONTHLY_PRICE_ID=price_1Xxxxxxxxxxx
STRIPE_YEARLY_PRICE_ID=price_1Yyyyyyyyy
DATABASE_URL=your-database-connection-url
NODE_ENV=production
EOF

# Method B: Using export commands
export NEXTAUTH_SECRET="your-long-secret-key-here"
export NEXTAUTH_URL="https://hapitech.in"
# ... etc for each variable
```

**Critical Variables** (Site won't work without these):
- [ ] NEXTAUTH_SECRET - Set and non-empty
- [ ] NEXTAUTH_URL - Set to https://hapitech.in
- [ ] GOOGLE_CLIENT_ID - Valid Google OAuth ID
- [ ] GOOGLE_CLIENT_SECRET - Valid Google OAuth secret
- [ ] DATABASE_URL - Valid database connection

**Optional But Recommended**:
- [ ] EMAIL_USER - For contact form
- [ ] EMAIL_PASS - Gmail App Password
- [ ] STRIPE_SECRET_KEY - For payments
- [ ] STRIPE_MONTHLY_PRICE_ID - Correct price ID
- [ ] STRIPE_YEARLY_PRICE_ID - Correct price ID

### Step 2: Update Code
```bash
# Pull latest code
git fetch origin
git pull origin main

# Verify files updated
git status  # Should show no uncommitted changes

# Install dependencies
npm install

# Verify installation
npm list next  # Should show v16.1.0
```

### Step 3: Build
```bash
# Create optimized production build
npm run build

# Should output:
# ✓ Compiled successfully
# ✓ Finished TypeScript
# ✓ Generating static pages
# Route (app) with 33 routes
# ╞Æ Proxy (Middleware)

# Verify no errors in output
```

### Step 4: Verify Build Output
Check that build shows:
```
✓ Compiled successfully
✓ Route (app) - 33 routes listed
✓ TypeScript validation passed
```

### Step 5: Deploy
Choose your deployment method:

#### Option A: Vercel (Easiest)
```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Deploy to production
vercel --prod

# Verify deployment
vercel ls  # Should show deployment

# Test live site
curl https://hapitech.in
```

#### Option B: Docker
```bash
# Build Docker image
docker build -t hapitech:latest .

# Run container with environment variables
docker run -d \
  --name hapitech \
  --env-file .env.production \
  -p 3000:3000 \
  hapitech:latest

# Verify container running
docker ps | grep hapitech
docker logs hapitech
```

#### Option C: PM2 (Node Process Manager)
```bash
# Install PM2 if not already installed
npm install -g pm2

# Build
npm run build

# Start with PM2
pm2 start npm --name hapitech --interpreter bash -- run start

# Verify
pm2 list  # Should show hapitech as online

# Set to restart on server reboot
pm2 startup
pm2 save
```

#### Option D: Traditional Node (nginx + node)
```bash
# Install pm2
npm install -g pm2

# Build
npm run build

# Start server
pm2 start npm --name hapitech -- run start

# Configure nginx reverse proxy
# /etc/nginx/sites-enabled/hapitech:
server {
  listen 80;
  server_name hapitech.in;
  
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

# Enable SSL with certbot
sudo certbot --nginx -d hapitech.in
```

### Step 6: Post-Deployment Tests

#### Test on Live Site (5-10 minutes after deployment)

**Authentication Tests** ✅
```bash
# 1. Test signup
- Go to https://hapitech.in/auth/signup
- Enter: name, email, password
- Verify: Account created successfully

# 2. Test login
- Go to https://hapitech.in/auth/login
- Enter credentials from signup
- Verify: Redirected to /tools/poster-generator

# 3. Test Google OAuth
- Click "Continue with Google"
- Verify: Redirected to /tools/poster-generator with session
```

**Dark Mode Tests** ✅
```bash
# 1. On iPhone (iOS)
- Settings > Display & Brightness > Dark
- Open https://hapitech.in/auth/login
- Verify: Email/password inputs visible and readable

# 2. On Android
- Settings > Display > Dark Theme (ON)
- Open https://hapitech.in/auth/signup
- Verify: All 4 input fields visible

# 3. Test Home Page
- https://hapitech.in
- No black shadows visible
- Text readable in both light and dark
```

**API Tests** ✅
```bash
# Test protected endpoint (should fail if not logged in)
curl https://hapitech.in/api/user/credits
# Should return: 401 Unauthorized

# Test contact form
curl -X POST https://hapitech.in/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test"}'
# Should return: 200 success

# Test with missing email
curl -X POST https://hapitech.in/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","subject":"Test","message":"Test"}'
# Should return: 400 with missing fields
```

**Browser Console Tests** ✅
```
1. Open https://hapitech.in
2. Press F12 to open DevTools
3. Go to Console tab
4. Should see:
   - NO red error messages
   - NO 401 Unauthorized messages (if not logged in, that's ok)
   - NO 500 errors
5. Check Network tab:
   - All API calls return status 200 or 401 (not 500)
```

### Step 7: Monitor

#### Check Server Logs
```bash
# For Vercel
vercel logs

# For Docker
docker logs -f hapitech

# For PM2
pm2 logs hapitech

# For traditional Node
tail -f ~/.pm2/logs/hapitech-*.log
```

#### Watch for Errors
Monitor for 24 hours and check:
- [ ] No unexpected 500 errors
- [ ] 401 errors only from unauthenticated users (expected)
- [ ] Email notifications being sent
- [ ] Stripe webhooks being received
- [ ] Database queries completing

#### Set Up Error Tracking (Optional but Recommended)
```typescript
// In production, add to next.config.ts:
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

---

## Rollback Plan

If something goes wrong in production:

### Quick Rollback (< 2 minutes)
```bash
# For Vercel
vercel rollback  # Automatic - reverts to previous deployment

# For Docker
docker stop hapitech
docker remove hapitech
docker run -d --name hapitech -p 3000:3000 hapitech:previous-tag

# For PM2
pm2 stop hapitech
git checkout previous-commit
npm install
npm run build
pm2 start npm --name hapitech -- run start
```

### If Rollback Needed
1. Stop new deployment immediately
2. Revert to previous version
3. Notify team
4. Investigate error in development
5. Redeploy once tested

---

## Documentation

Share these files with your team:

1. **COMPLETE_FIXES_SUMMARY.md** - What was fixed and why
2. **API_ERROR_FIX_GUIDE.md** - Error handling reference
3. **DARK_MODE_AND_AUTH_FIXES.md** - Authentication details

---

## Success Criteria

Deployment is successful when:

- [x] Build completes with 0 errors (✅ verified)
- [ ] All 33 routes visible in production
- [ ] Signup/login working
- [ ] Google OAuth working
- [ ] Dashboard accessible for logged-in users
- [ ] Protected APIs return 401 for non-authenticated users
- [ ] Contact form works and sends emails
- [ ] Subscription checkout with Stripe works
- [ ] Dark mode works on mobile
- [ ] No red errors in browser console
- [ ] Server logs show no 500 errors
- [ ] Email notifications being sent
- [ ] Stripe webhooks processed successfully

---

## Support During Deployment

If issues occur:

1. **Check environment variables first**
   ```bash
   env | grep NEXT
   env | grep EMAIL
   env | grep STRIPE
   ```

2. **Check logs immediately**
   ```bash
   # Show last 100 lines of errors
   docker logs hapitech | tail -100
   ```

3. **Verify database connection**
   ```bash
   npx prisma db execute --stdin < <(echo "SELECT 1;")
   ```

4. **Rebuild if needed**
   ```bash
   rm -rf .next
   npm run build
   ```

5. **Contact development team if**:
   - Build fails with TypeScript errors
   - Persistent 500 errors in specific endpoints
   - Database connection fails
   - Email service not responding

---

## Timeline

Expected deployment timeline:
- Environment setup: 5 minutes
- Code pull: 2 minutes
- Build: 5-10 minutes
- Deploy: 2-5 minutes
- Testing: 5-10 minutes
- **Total: 20-35 minutes**

---

## Post-Deployment Tasks

After successful deployment:

1. [ ] Update status page/notify users if applicable
2. [ ] Monitor error logs for 24 hours
3. [ ] Verify all critical features working
4. [ ] Test on multiple devices/browsers
5. [ ] Document any issues found
6. [ ] Update internal documentation
7. [ ] Archive old deployment (if using Docker)
8. [ ] Update version number in package.json for next release

---

**Checklist Version**: 1.0  
**Created**: January 8, 2026  
**For**: hapitech.in Production Deployment  
**Status**: READY FOR DEPLOYMENT ✅
