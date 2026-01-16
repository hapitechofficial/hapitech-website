import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-razorpay-signature');

    // Verify webhook signature if webhook secret is configured
    if (process.env.RAZORPAY_WEBHOOK_SECRET && signature) {
      const payload = JSON.stringify(body);
      const hash = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

      if (hash !== signature) {
        console.error('[RAZORPAY] Webhook signature verification failed');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const event = body.event;
    const paymentData = body.payload.payment.entity;

    if (event === 'payment.authorized' || event === 'payment.captured') {
      const orderId = paymentData.order_id;
      const paymentId = paymentData.id;

      // Get order details from Razorpay notes or database
      const notes = paymentData.notes || {};
      const userId = notes.userId;
      const plan = notes.plan;

      if (userId && plan) {
        // Update user subscription
        const subscription = await prisma.subscription.upsert({
          where: { userId },
          update: {
            status: 'active',
            planId: plan,
            razorpayId: paymentId as any,
            razorpayOrderId: orderId,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
          },
          create: {
            userId,
            status: 'active',
            planId: plan,
            razorpayId: paymentId as any,
            razorpayOrderId: orderId,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
          },
        });

        // Add credits to user based on subscription plan
        const creditsToAdd = plan === 'yearly' ? 180 : 45; // 180 for yearly (15 per day for 12 months), 45 for monthly (15 per day for 3 months)
        await prisma.user.update({
          where: { id: userId },
          data: {
            credits: {
              increment: creditsToAdd,
            },
          },
        });

        // Send confirmation email
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true, name: true },
        });

        if (user) {
          const html = `
            <h2>Subscription Activated</h2>
            <p><strong>User:</strong> ${user.name} (${user.email})</p>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Amount:</strong> ${plan === 'yearly' ? '₹15,000/year' : '₹1,500/month'}</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
            <p>Subscription is now active! You can now generate up to 15 posters per day.</p>
          `;

          try {
            await sendEmail(process.env.EMAIL_USER!, `Subscription Activated: ${plan}`, html);
          } catch (emailError) {
            console.error('Email send error:', emailError);
          }
        }
      }
    } else if (event === 'payment.failed') {
      console.log('[RAZORPAY] Payment failed:', body);
      // Handle failed payment
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[RAZORPAY] Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing error' }, { status: 500 });
  }
}
