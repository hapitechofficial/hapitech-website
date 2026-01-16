# 🧪 Razorpay Payment System - Testing Guide

## Quick Start Testing

Your payment system is now LIVE. Here's how to test it:

---

## ✅ Verify Everything is Running

### Check if dev server is running:
Visit: http://localhost:3000

You should see the home page loading.

---

## 🧪 Test the Payment Flow

### Step 1: Get Test Credentials
1. Go to https://dashboard.razorpay.com/
2. Look for "Test Mode" toggle (top-left area)
3. Switch to **Test Mode**
4. Copy your **Test Key ID** and **Test Key Secret**

### Step 2: Update .env.local (Optional - for testing)
```env
RAZORPAY_KEY_ID=rzp_test_XXXXX          # Test key
RAZORPAY_KEY_SECRET=XXXXX               # Test secret
```

Or keep using your live keys - they work in both test and live mode.

### Step 3: Restart Dev Server
```bash
npm run dev
```

### Step 4: Navigate to Subscription Page
```
http://localhost:3000/dashboard/subscription
```

You need to be logged in. If not logged in:
1. Go to http://localhost:3000/auth/login
2. Login with a test account

### Step 5: Click "Subscribe Monthly"

A Razorpay modal should appear.

### Step 6: Enter Test Card Details

| Field | Value |
|-------|-------|
| Card Number | 4111 1111 1111 1111 |
| CVV | 123 |
| Expiry | 12/25 |

### Step 7: Complete Payment

- Enter OTP if asked (use any 6 digits)
- Click Pay
- You should see success message

### Step 8: Verify Subscription

After successful payment, you should:
1. See "Premium Active" message
2. Be able to generate 15 posters/day
3. Receive email confirmation
4. Have subscription in database

---

## 🔍 Verify Database Update

### Check if subscription was created:

```bash
# Open Prisma Studio
npx prisma studio
```

Then navigate to Subscription table and look for your user's record with:
- status: "active"
- planId: "monthly"
- razorpayId: "pay_xxx"

---

## 📱 Test Daily Poster Limits

### Test as Free User (No Subscription)

1. Create a new account (different email)
2. Try to generate 6 posters
3. After 5th poster, you should get error:
   ```
   "You've reached your daily poster generation limit (5 posters)."
   ```

### Test as Premium User (Active Subscription)

1. Subscribe to monthly plan
2. Generate 16 posters
3. After 15th poster, you should get error:
   ```
   "You've reached your daily poster generation limit (15 posters)."
   ```

---

## ✅ Checklist - Everything Should Work

- [ ] Dev server running (http://localhost:3000)
- [ ] Can navigate to subscription page
- [ ] Can see pricing (Monthly ₹1,500, Yearly ₹15,000)
- [ ] Razorpay modal opens on subscribe click
- [ ] Test card payment completes
- [ ] Subscription status shows "Premium Active"
- [ ] Can generate 15 posters/day
- [ ] Email confirmation received
- [ ] Subscription visible in Prisma Studio
- [ ] Free users limited to 5 posters/day
- [ ] Paid users limited to 15 posters/day

---

## 🐛 Troubleshooting

### Issue: "Razorpay not found" error
**Solution**: 
- Make sure `npm install` completed successfully
- Check that `razorpay` appears in `node_modules`
- Restart dev server: `npm run dev`

### Issue: Payment modal doesn't open
**Solution**:
- Check browser console for errors (F12)
- Verify Razorpay script is loading
- Ensure RAZORPAY_KEY_ID is set in `.env.local`
- Restart dev server

### Issue: Payment fails at verification
**Solution**:
- Check RAZORPAY_KEY_SECRET is correct
- Verify signature verification logic
- Check browser console for error messages
- Try with test cards first

### Issue: Subscription not updating in database
**Solution**:
- Check database connection in `.env.local`
- Verify Prisma migration ran: `npx prisma migrate status`
- Check server logs for errors
- Try restarting dev server

### Issue: Daily limits not working
**Solution**:
- Verify user has active subscription in database
- Check if subscription status is "active"
- Try generating poster and check API response
- Look for error messages in console

---

## 📊 What Happens Behind the Scenes

### On Subscribe Click
1. Frontend calls `/api/subscription/create`
2. Backend creates Razorpay order
3. Razorpay modal opens with payment details
4. User enters card/UPI details

### On Payment Success
1. Razorpay processes payment
2. Frontend calls `/api/subscription/verify`
3. Backend verifies signature with Razorpay secret
4. Fetches payment details from Razorpay API
5. Updates database with subscription
6. Sends email confirmation

### Daily Limit Check
1. User tries to generate poster
2. API checks subscription status
3. Counts posters generated today
4. Compares with limit (5 free / 15 paid)
5. Allows or denies based on limit

---

## 🔐 Security Notes

- ✅ Payment signatures verified (HMAC SHA256)
- ✅ Only authorized users can subscribe
- ✅ Payment IDs validated with Razorpay API
- ✅ Database protected with proper validation
- ✅ No sensitive data stored locally
- ✅ Webhook events authenticated

---

## 📞 Test Data

### Test User Account
```
Email: test@example.com
Password: TestPassword123
Plan: Monthly (₹1,500)
```

### Test Payment Details
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
OTP: Any 6 digits (e.g., 123456)
```

---

## 🚀 After Testing

### When Everything Works
1. Switch to production Razorpay keys
2. Update `.env.local` with live keys:
   ```env
   RAZORPAY_KEY_ID=rzp_live_XXXXX
   RAZORPAY_KEY_SECRET=XXXXX
   ```
3. Deploy to production
4. Configure webhook in Razorpay dashboard

### Production Webhook Setup
1. Go to Razorpay Dashboard
2. Settings → Webhooks
3. Add URL: `https://yourdomain.com/api/webhook/razorpay`
4. Select events: payment.authorized, payment.captured
5. Copy webhook secret
6. Update `.env.local`: `RAZORPAY_WEBHOOK_SECRET=whsec_...`

---

## 📈 Monitoring Payments

### View in Razorpay Dashboard
1. Go to https://dashboard.razorpay.com/
2. Click "Payments" to see all transactions
3. Click on payment to see details
4. Check webhook status in Settings

### View in Database
```bash
npx prisma studio
# Go to Subscription table
# Look for your test user's record
```

### View in Logs
```bash
# Server logs show subscription creation/verification
# Email logs show confirmations sent
# Check .next/logs or console output
```

---

## ✨ Success Indicators

When everything is working correctly, you'll see:

✅ Payment modal opens with Razorpay branding
✅ Test card payment completes in <5 seconds
✅ Success page appears with "Premium Active"
✅ User can generate 15 posters immediately
✅ Subscription visible in database
✅ Email confirmation sent to user
✅ Free users get limited to 5 posters/day
✅ Paid users can generate 15 posters/day

---

## 🎉 You're Ready!

Your Razorpay payment system is **LIVE** and **READY FOR TESTING**.

**Start testing**: Visit http://localhost:3000 now!

If you have any issues, check the troubleshooting section above.
