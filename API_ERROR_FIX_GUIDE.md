# 401 & 500 Error Fixes - Complete Resolution Guide

## Summary of Fixes

### Issue 1: 401 Unauthorized Errors
**Problem**: Users were getting 401 errors when API endpoints tried to verify authentication.

**Root Cause**: 
- Protected API endpoints require JWT token validation
- Tokens weren't being validated properly for all requests
- Middleware wasn't intercepting requests to check authentication

**Solutions Implemented**:
1. Created `middleware.ts` - Validates JWT tokens for protected routes
2. Updated API endpoints to provide clearer auth error messages
3. Added logging to debug authentication failures
4. Implemented token verification on protected routes

### Issue 2: 500 Internal Server Errors
**Problem**: API endpoints were crashing with generic 500 errors.

**Root Causes**:
- Missing environment variables (EMAIL_USER, STRIPE keys, etc.)
- Unhandled exceptions in try-catch blocks
- Email service failures causing cascade errors
- Invalid input validation

**Solutions Implemented**:
1. Created `lib/apiErrorHandler.ts` - Centralized error handling
2. Created `lib/apiClient.ts` - Client-side API wrapper with error handling
3. Added proper error categorization (401, 402, 403, 404, 429, 500, 503)
4. Made email notifications non-blocking (won't crash if email fails)
5. Added environment variable validation
6. Improved input validation and sanitization

---

## Files Created/Modified

### New Files
1. **`middleware.ts`** - Authentication middleware for protected routes
2. **`lib/apiErrorHandler.ts`** - Centralized error handling utility
3. **`lib/apiClient.ts`** - Client-side API helpers with error handling

### Modified Files
1. **`app/api/user/credits/route.ts`** - Better error messages
2. **`app/api/subscription/create/route.ts`** - Stripe validation, better errors
3. **`app/api/contact/route.ts`** - Email validation, input sanitization
4. **`app/api/poster/generate/route.ts`** - Non-blocking email, error categorization

---

## Error Status Codes Explained

| Code | Meaning | Fix |
|------|---------|-----|
| **401** | Unauthorized | User must sign in |
| **402** | Payment Required | Insufficient credits |
| **403** | Forbidden | User lacks permissions |
| **404** | Not Found | Resource doesn't exist |
| **429** | Rate Limited | Too many requests |
| **500** | Server Error | Check logs and environment variables |
| **503** | Service Unavailable | External service down (Stripe, Email) |

---

## Environment Variables Required

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://hapitech.in

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Email Service
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Stripe Payment
STRIPE_SECRET_KEY=sk_live_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...

# Database
DATABASE_URL=your-database-url

# Optional
NODE_ENV=production
```

---

## How Authentication Middleware Works

```
Request → middleware.ts → Check JWT Token
  ├─ Valid Token → Allow Request
  ├─ Missing Token → Return 401
  └─ Invalid Token → Return 401
```

Protected Routes:
- `/api/user/credits` - Get user credits
- `/api/subscription/create` - Create subscription
- `/api/poster/generate` - Generate poster

---

## API Error Handler Usage Examples

### In API Routes

```typescript
// Before
if (!session?.user?.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// After (Better)
import { APIErrorHandler } from '@/lib/apiErrorHandler';

if (!session?.user?.id) {
  const error = APIErrorHandler.unauthorized('Please sign in first');
  return NextResponse.json(error, { status: error.status });
}
```

### Handling Different Error Types

```typescript
if (!priceId) {
  const error = APIErrorHandler.configurationError('Stripe');
  return NextResponse.json(error, { status: error.status });
}

try {
  // ... operation ...
} catch (error) {
  const apiError = APIErrorHandler.parseError(error, 'generate poster');
  return NextResponse.json(apiError, { status: apiError.status });
}
```

### Client Side

```typescript
import { apiPost } from '@/lib/apiClient';

const handleSubscribe = async (plan) => {
  const { data, error } = await apiPost('/api/subscription/create', { plan });
  
  if (error) {
    // Handle different error types
    if (error.status === 401) {
      // Redirect to login
    } else if (error.status === 402) {
      // Show payment required message
    } else {
      // Show generic error
      alert(error.message);
    }
  } else {
    // Use data
  }
};
```

---

## Testing Checklist

### Authentication (401) Tests
- [ ] Logged out user tries to fetch `/api/user/credits` → Should get 401
- [ ] Logged out user tries to create subscription → Should get 401
- [ ] Logged out user tries to generate poster → Should get 401
- [ ] Logged in user can access these endpoints → Should work

### Configuration (500/503) Tests
- [ ] Missing EMAIL_USER → Contact form shows 503
- [ ] Missing STRIPE_SECRET_KEY → Subscription shows 500
- [ ] Missing NEXTAUTH_SECRET → Login shows 500

### Input Validation (400) Tests
- [ ] Contact form with missing fields → Should get 400 with field list
- [ ] Invalid email in contact form → Should get 400
- [ ] Subscription with invalid plan → Should get 400

### Rate Limiting (429) Tests
- [ ] Generate 5+ posters same day → Should get 429 after limit

### Server Errors (500) Tests
- [ ] Database connection fails → Should get 500 with helpful message
- [ ] Email service timeout → Should get 503 (non-blocking)

---

## Common Issues & Solutions

### Issue: Still Getting 401 on Protected Routes
**Check**:
1. Is NEXTAUTH_SECRET set correctly?
2. Is user logged in? Check browser Storage → nextauth.jwt-token
3. Are cookies enabled?
4. Is middleware.ts in root directory?

### Issue: Email Not Sending (500/503)
**Check**:
1. Is EMAIL_USER configured?
2. Is EMAIL_PASS an app password (not regular password)?
3. Is Gmail account allowing SMTP?
4. Check server logs for EAUTH errors

### Issue: Stripe Errors (500)
**Check**:
1. Is STRIPE_SECRET_KEY set?
2. Is STRIPE_MONTHLY_PRICE_ID set?
3. Is STRIPE_YEARLY_PRICE_ID set?
4. Are price IDs valid in Stripe dashboard?

### Issue: Still Getting 500 on Custom Error
**Check**:
1. Are you catching the error properly?
2. Is error message being logged?
3. Check server logs: `npm run dev`
4. Is the error being thrown before response is sent?

---

## Deployment Steps

1. **Update Environment Variables**
   ```bash
   # On production server
   export NEXTAUTH_SECRET=your-secret
   export STRIPE_SECRET_KEY=sk_live_...
   # ... etc
   ```

2. **Pull Latest Code**
   ```bash
   git pull origin main
   npm install
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Verify No Build Errors**
   - Check that all 33 routes compile successfully
   - No TypeScript errors

5. **Deploy**
   ```bash
   # Your deployment command (Vercel, Docker, etc.)
   ```

6. **Test on Live Site**
   - Test signup/login
   - Test protected endpoints
   - Check browser console for errors
   - Check server logs for warnings

7. **Monitor**
   - Watch server logs for new 401/500 errors
   - Check email notifications
   - Monitor Stripe webhook processing

---

## Logging & Monitoring

### Server-Side Logs
All errors include context:
```
[API] Unauthorized request: User not authenticated
[API] Configuration error: Stripe not configured
[API] Internal error in generate poster: ECONNREFUSED
```

### Client-Side Logging
Check browser console:
```
[API] Unauthorized - User needs to sign in
[API] Rate limited
[API] Fetch error: Network error
```

---

## Production Best Practices

1. **Never log sensitive data** (passwords, tokens, keys)
2. **Don't expose error details to users in production**
3. **Make external service calls non-blocking** (email, SMS)
4. **Validate all user inputs** before database operations
5. **Handle timeouts gracefully** with proper status codes
6. **Monitor 5xx errors** - they indicate server problems
7. **Log 4xx errors** - they help debug client issues
8. **Use rate limiting** for sensitive operations

---

## Support & Debugging

### Enable Detailed Logging
Set in `.env`:
```env
DEBUG=*
LOG_LEVEL=debug
```

### Check Server Logs
```bash
# For Docker/production
docker logs container-name | grep "ERROR\|WARN"

# For development
npm run dev 2>&1 | tee server.log
```

### Test API Endpoints
```bash
# Test authentication
curl -X GET http://localhost:3000/api/user/credits

# Test with auth header (after getting token)
curl -X GET http://localhost:3000/api/user/credits \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test POST endpoint
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test"}'
```

---

**Last Updated**: January 8, 2026
**Status**: Production Ready ✅
