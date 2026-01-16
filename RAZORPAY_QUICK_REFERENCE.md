# Quick Reference - Razorpay Integration Guide

## Files Modified/Created

### Core API Changes
```
✅ app/api/subscription/create/route.ts       [REWRITTEN] Razorpay order creation
✅ app/api/subscription/verify/route.ts       [NEW] Payment verification
✅ app/api/webhook/razorpay/route.ts          [NEW] Webhook handler
✅ app/api/poster/generate/route.ts           [UPDATED] Daily limits (5 free, 15 paid)
```

### Database & Config
```
✅ prisma/schema.prisma                       [UPDATED] Added razorpayId, razorpayOrderId
✅ package.json                               [UPDATED] Removed Stripe, added Razorpay
✅ .env.local                                 [UPDATED] Razorpay credentials
```

### Frontend Changes
```
✅ components/LoginForm.tsx                   [UPDATED] Redirect to /
✅ components/SignupForm.tsx                  [UPDATED] Redirect to /
✅ components/SubscriptionClient.tsx          [UPDATED] New prices (₹1500/₹15000)
✅ components/poster-generator/SubscriptionModal.tsx  [UPDATED] New prices
✅ lib/auth.ts                                [UPDATED] Callback redirect
```

---

## Key Configuration Values

### Prices (in paisa)
```javascript
Monthly:  150000 paisa = ₹1,500
Yearly:  1500000 paisa = ₹15,000
```

### Daily Poster Limits
```javascript
Free User:     5 posters/day
Paid User:    15 posters/day
```

### Environment Variables Required
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_xxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxx
```

---

## API Endpoints

### 1. Create Subscription Order
```bash
POST /api/subscription/create
Content-Type: application/json

{
  "plan": "monthly" | "yearly"
}

Response:
{
  "orderId": "order_...",
  "amount": 150000,
  "currency": "INR",
  "keyId": "rzp_...",
  "plan": "monthly",
  "userId": "user_id",
  "userName": "User Name",
  "userEmail": "user@example.com"
}
```

### 2. Verify Payment
```bash
POST /api/subscription/verify
Content-Type: application/json

{
  "razorpayPaymentId": "pay_...",
  "razorpayOrderId": "order_...",
  "razorpaySignature": "signature_hash",
  "plan": "monthly" | "yearly"
}

Response:
{
  "success": true,
  "message": "Payment verified and subscription activated",
  "subscription": {
    "status": "active",
    "planId": "monthly"
  }
}
```

### 3. Webhook Event
```
POST /api/webhook/razorpay
X-Razorpay-Signature: signature_hash

{
  "event": "payment.authorized" | "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_...",
        "order_id": "order_...",
        "status": "captured",
        "notes": {
          "userId": "user_id",
          "plan": "monthly"
        }
      }
    }
  }
}
```

---

## Common Error Messages

### Poster Generation
```json
{
  "error": "You've reached your daily poster generation limit (5 posters). Upgrade to premium for up to 15 posters per day.",
  "upgradeRequired": true,
  "dailyLimit": 5,
  "generatedToday": 5
}
```

### Subscription Payment
```json
{
  "error": "Payment verification failed",
  "details": "signature verification failed"
}
```

---

## Database Queries

### Get User Subscription
```javascript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { subscription: true }
});

// Check if subscribed
const isSubscribed = user?.subscription?.status === 'active';
const dailyLimit = isSubscribed ? 15 : 5;
```

### Count Today's Posters
```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const count = await prisma.posterGeneration.count({
  where: {
    userId: userId,
    createdAt: { gte: today, lt: tomorrow },
    status: 'completed'
  }
});
```

### Update Subscription After Payment
```javascript
const subscription = await prisma.subscription.upsert({
  where: { userId: userId },
  update: {
    status: 'active',
    planId: plan,
    razorpayId: paymentId,
    razorpayOrderId: orderId,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)
  },
  create: {
    userId,
    status: 'active',
    planId: plan,
    razorpayId: paymentId,
    razorpayOrderId: orderId,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000)
  }
});
```

---

## Deployment Checklist

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Create & apply migration
npx prisma migrate dev --name add_razorpay_fields

# 4. Update environment variables
# Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET

# 5. Start development server
npm run dev

# 6. Test endpoints
curl http://localhost:3000/api/subscription/create
```

---

## Frontend Implementation Example

```typescript
// Subscribe to a plan
const response = await fetch('/api/subscription/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ plan: 'monthly' })
});

const orderData = await response.json();

// Open Razorpay payment modal
const options = {
  key: orderData.keyId,
  amount: orderData.amount,
  currency: orderData.currency,
  order_id: orderData.orderId,
  name: 'hApItech',
  description: `${orderData.plan} subscription`,
  prefill: {
    name: orderData.userName,
    email: orderData.userEmail
  },
  handler: async (response) => {
    // Verify payment
    const verifyResponse = await fetch('/api/subscription/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpayPaymentId: response.razorpay_payment_id,
        razorpayOrderId: response.razorpay_order_id,
        razorpaySignature: response.razorpay_signature,
        plan: orderData.plan
      })
    });
    
    if (verifyResponse.ok) {
      // Payment successful
      alert('Subscription activated!');
      window.location.reload();
    }
  },
  theme: {
    color: '#FF6B9D' // Magenta color
  }
};

// Load Razorpay and open checkout
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
script.onload = () => {
  new window.Razorpay(options).open();
};
document.head.appendChild(script);
```

---

## Testing with Razorpay Test Mode

### Test Cards
| Card | Input |
|------|-------|
| Success | 4111 1111 1111 1111 |
| Failure | 4222 2222 2222 2222 |
| Any CVV | 123 |
| Any Expiry | 12/25 |

### Get Test Keys
1. Go to https://dashboard.razorpay.com/
2. Settings → API Keys
3. Switch to "Test" mode
4. Copy Key ID and Key Secret

---

## Webhook Setup

### 1. Configure in Razorpay Dashboard
- Go to Settings → Webhooks
- Add new webhook
- URL: `https://yourdomain.com/api/webhook/razorpay`
- Events: `payment.authorized`, `payment.captured`
- Copy webhook secret

### 2. Set Environment Variable
```env
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxx
```

### 3. Test Webhook
- From dashboard, click "Send Test Event"
- Check application logs for webhook receipt

---

## Migration from Stripe Data

If users had active Stripe subscriptions:
1. They will appear as non-subscribed in new system
2. They can re-subscribe with Razorpay
3. No data loss - old Stripe subscription records preserved in database
4. Consider grace period or discount for migration

---

## Support Resources

- **Razorpay Docs:** https://razorpay.com/docs/
- **API Reference:** https://razorpay.com/api/
- **Dashboard:** https://dashboard.razorpay.com/
- **Support Email:** support@razorpay.com

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module 'razorpay'" | Run `npm install` |
| Prisma field errors | Run `npx prisma generate` |
| Webhook signature fails | Verify RAZORPAY_WEBHOOK_SECRET |
| Payment verification fails | Check RAZORPAY_KEY_SECRET is correct |
| Users not getting subscribed | Check webhook logs in Razorpay dashboard |

---

**Last Updated:** January 15, 2026
**Version:** 1.0
