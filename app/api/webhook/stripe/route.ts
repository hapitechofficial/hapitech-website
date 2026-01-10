import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

// Guard: Return 200 if Stripe is not configured
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn('[STRIPE] Stripe webhook disabled - missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // If Stripe not configured, return 200 OK (prevent errors)
  if (!stripe || !endpointSecret) {
    console.warn('[STRIPE] Stripe disabled - returning 200 OK');
    return NextResponse.json({ success: true, message: 'Stripe disabled' }, { status: 200 });
  }

  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('[STRIPE] Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        // Update user subscription
        await prisma.subscription.upsert({
          where: { userId },
          update: {
            status: 'active',
            planId: plan,
            stripeId: session.subscription as string,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
          },
          create: {
            userId,
            status: 'active',
            planId: plan,
            stripeId: session.subscription as string,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
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
            <p>Subscription is now active!</p>
          `;

          await sendEmail(process.env.EMAIL_USER!, `New Subscription: ${plan}`, html);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing error' }, { status: 500 });
  }
}