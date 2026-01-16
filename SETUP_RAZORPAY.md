# Post-Deployment Setup Instructions

## IMPORTANT: Required Before Running the Application

### 1. Install Dependencies
After pulling the latest code, run:
```bash
npm install
```

### 2. Database Migration
Run Prisma migration to update the database schema:
```bash
npx prisma migrate dev --name add_razorpay_fields
```

This will:
- Add `razorpayId` field to Subscription table
- Add `razorpayOrderId` field to Subscription table
- Remove `stripeId` field from Subscription table

### 3. Environment Variables
Add the following to your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID="your_razorpay_key_id_here"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret_here"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret_here"
```

Get these from your Razorpay dashboard:
1. Go to https://dashboard.razorpay.com/
2. Navigate to Settings → API Keys
3. Copy your Key ID and Key Secret
4. Create a webhook endpoint at https://yourdomain.com/api/webhook/razorpay
5. Set webhook secret and copy it

### 4. Remove Stripe Variables (Optional)
If you want to clean up `.env.local`, you can remove these Stripe variables:
```
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY  
STRIPE_WEBHOOK_SECRET
STRIPE_MONTHLY_PRICE_ID
STRIPE_YEARLY_PRICE_ID
```

## Key Changes Summary

### Payments
- ✅ Stripe → Razorpay migration complete
- ✅ New endpoints: `/api/subscription/create`, `/api/subscription/verify`
- ✅ New webhook: `/api/webhook/razorpay`

### Pricing
- ✅ Monthly: ₹1,500/month (was ₹999/month)
- ✅ Yearly: ₹15,000/year (was ₹9,999/year)

### Poster Limits
- ✅ Free users: 5 posters/day (was unlimited or credit-based)
- ✅ Paid users: 15 posters/day

### Authentication Redirects
- ✅ After signup: Redirect to `/` (home page)
- ✅ After login: Redirect to `/` (home page)
- ✅ After Google OAuth: Redirect to `/` (home page)

## Testing the Integration

### 1. Test Subscription Creation
```bash
curl -X POST http://localhost:3000/api/subscription/create \
  -H "Content-Type: application/json" \
  -d '{"plan":"monthly"}'
```

Expected response:
```json
{
  "orderId": "order_xyz...",
  "amount": 150000,
  "currency": "INR",
  "keyId": "rzp_...",
  "userName": "User Name",
  "userEmail": "user@example.com",
  "plan": "monthly",
  "userId": "user_id"
}
```

### 2. Test Payment Verification
After making payment in Razorpay, call:
```bash
curl -X POST http://localhost:3000/api/subscription/verify \
  -H "Content-Type: application/json" \
  -d '{
    "razorpayPaymentId": "pay_xyz...",
    "razorpayOrderId": "order_xyz...",
    "razorpaySignature": "signature...",
    "plan": "monthly"
  }'
```

### 3. Test Poster Limits
- Create a free account and try to generate 6 posters in one day
- Should get error after 5 posters
- Subscribe and verify you can now generate 15 posters per day

## Troubleshooting

### "Cannot find module 'razorpay'"
- Make sure you ran `npm install`
- Check that `razorpay` appears in `package.json`

### Prisma field errors
- Run `npx prisma generate` to regenerate Prisma client
- Run `npx prisma db push` if migration failed

### Webhook signature errors
- Verify `RAZORPAY_WEBHOOK_SECRET` matches Razorpay dashboard
- Check that webhook URL is publicly accessible
- Test webhook from Razorpay dashboard

### Payment verification fails
- Check that `RAZORPAY_KEY_SECRET` is correct
- Verify signature calculation matches Razorpay docs
- Check request body format matches expected format

## Rollback (If Needed)

To rollback to Stripe:
1. Restore previous database migration: `npx prisma migrate resolve --rolled-back add_razorpay_fields`
2. Restore old API files from git
3. Reinstall Stripe packages: `npm install stripe @stripe/stripe-js`
4. Update environment variables back to Stripe keys

## Next Steps

1. Update Razorpay webhook URL in dashboard
2. Test payment flow with test keys first
3. Move to production Razorpay keys
4. Update documentation for support team
5. Notify users about pricing changes
6. Monitor webhook deliveries in Razorpay dashboard

## Support

For Razorpay integration help:
- Docs: https://razorpay.com/docs/
- API Reference: https://razorpay.com/api/
- Dashboard: https://dashboard.razorpay.com/
