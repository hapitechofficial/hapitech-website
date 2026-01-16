# Razorpay Migration & Authentication Flow Changes - Summary

## Overview
Successfully migrated from Stripe to Razorpay for subscription payments and updated authentication redirects to home page.

## Changes Made

### 1. Database Schema Updates
**File:** `prisma/schema.prisma`
- Replaced `stripeId` with `razorpayId` in Subscription model
- Added `razorpayOrderId` field for tracking Razorpay orders
- Updated Subscription model to support Razorpay payment tracking

### 2. Dependencies
**File:** `package.json`
- Removed: `@stripe/stripe-js` and `stripe`
- Added: `razorpay` (v2.9.2)

### 3. Environment Configuration
**File:** `.env.local`
- Removed Stripe configuration variables:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Added Razorpay configuration variables:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `RAZORPAY_WEBHOOK_SECRET`
  - `RAZORPAY_MONTHLY_PLAN_ID` (for tracking)
  - `RAZORPAY_YEARLY_PLAN_ID` (for tracking)

### 4. Payment API Endpoints

#### Subscription Creation
**File:** `app/api/subscription/create/route.ts` (Complete Rewrite)
- Changed from Stripe checkout sessions to Razorpay order creation
- Returns Razorpay order details with:
  - `orderId`: Order ID from Razorpay
  - `amount`: Amount in paisa (100 paisa = 1 rupee)
  - `currency`: INR
  - `keyId`: Razorpay public key for frontend
  - `userId`, `userName`, `userEmail`, `plan`: User details

#### Payment Verification (New)
**File:** `app/api/subscription/verify/route.ts`
- New endpoint to verify payment signature after Razorpay payment
- Verifies HMAC SHA256 signature
- Updates subscription in database upon successful verification
- Sends confirmation email to admin

#### Razorpay Webhook Handler (New)
**File:** `app/api/webhook/razorpay/route.ts`
- Handles webhook events from Razorpay
- Processes `payment.authorized` and `payment.captured` events
- Updates subscription status in database
- Sends confirmation emails

### 5. Subscription Pricing
**Files:** 
- `components/SubscriptionClient.tsx`
- `components/poster-generator/SubscriptionModal.tsx`

**Updated prices:**
- **Monthly:** ₹1,500/month (previously ₹999/month)
- **Yearly:** ₹15,000/year (previously ₹9,999/year)
- Updated feature descriptions to reflect 15 posters per day limit

### 6. Poster Generation Limits
**File:** `app/api/poster/generate/route.ts`

**New daily limits:**
- **Free users:** 5 posters per day
- **Paid subscribers:** 15 posters per day
- Error messages properly indicate current limits and daily progress

### 7. Authentication Redirects
**Files:**
- `components/LoginForm.tsx`
- `components/SignupForm.tsx`
- `lib/auth.ts`

**Changes:**
- After login/signup via email: Redirects to `/` (home page)
- After Google OAuth: Redirects to `/` (home page)
- Updated auth callback redirect to default to `/` instead of `/tools/poster-generator`

## Implementation Details

### Razorpay Integration

#### Amount Conversion
- Razorpay uses paisa (100 paisa = 1 rupee)
- Monthly: ₹1,500 = 150,000 paisa
- Yearly: ₹15,000 = 1,500,000 paisa

#### Order Creation Flow
1. User clicks subscribe
2. Frontend calls `/api/subscription/create`
3. Backend creates Razorpay order
4. Returns order details to frontend
5. Frontend opens Razorpay payment modal
6. User enters payment details
7. Payment processed on Razorpay
8. Frontend verifies payment via `/api/subscription/verify`
9. Backend updates subscription in database
10. Webhook confirms payment (backup)

#### Signature Verification
- Uses HMAC SHA256
- Format: `{orderId}|{paymentId}`
- Secret: `RAZORPAY_KEY_SECRET`

### Free vs Paid User Behavior

#### Free Users (No Active Subscription)
- Can generate 5 posters per day
- Need subscription to generate more
- Receive modal prompting to subscribe

#### Paid Users (Active Subscription)
- Can generate 15 posters per day
- Can exceed with subscription plans
- Proper daily reset at midnight

## Testing Checklist

After deployment:

1. **Database Migration**
   ```bash
   npx prisma migrate dev
   ```

2. **Test Razorpay Configuration**
   - Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set
   - Test webhook with Razorpay dashboard

3. **Test Auth Redirects**
   - Sign up with email → should go to `/`
   - Login with email → should go to `/`
   - Sign up with Google → should go to `/`
   - Login with Google → should go to `/`

4. **Test Subscription Flow**
   - Create subscription order
   - Verify payment with correct signature
   - Check subscription status in database
   - Verify email notification sent

5. **Test Poster Generation Limits**
   - Free user can generate 5 posters/day
   - After 5th poster, gets limit error
   - Paid user can generate 15 posters/day
   - After 15th poster, gets limit error
   - Limits reset at midnight

## Configuration Required

You must add the following to `.env.local` or Vercel environment variables:

```
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here
```

## Frontend Integration Example

```typescript
// Create subscription order
const response = await fetch('/api/subscription/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ plan: 'monthly' })
});

const orderData = await response.json();

// Open Razorpay checkout
const options = {
  key: orderData.keyId,
  amount: orderData.amount,
  currency: orderData.currency,
  order_id: orderData.orderId,
  name: 'hApItech',
  description: `${orderData.plan} subscription`,
  handler: async (response) => {
    // Verify payment
    await fetch('/api/subscription/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        plan: orderData.plan
      })
    });
  }
};

// Load Razorpay and open checkout
```

## Backwards Compatibility

All existing poster generation history is preserved. The system correctly identifies:
- Users with no subscription (free tier)
- Users with active subscriptions (premium tier)

## Notes

- Stripe references have been completely removed
- Old Stripe webhook at `/api/webhook/stripe` still exists but is disabled
- All pricing and limits are configurable in the code
- Subscription verification happens both via webhook and direct API call for reliability
