import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('[SUBSCRIPTION] User not authenticated');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please sign in to subscribe' },
        { status: 401 }
      );
    }

    // Guard: If Stripe not configured, return helpful error
    if (!stripe || !process.env.STRIPE_SECRET_KEY) {
      console.warn('[SUBSCRIPTION] Stripe not configured');
      return NextResponse.json(
        { error: 'Payment system unavailable', message: 'Subscription service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const { plan } = await request.json(); // 'monthly' or 'yearly'

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan', message: 'Plan must be monthly or yearly' },
        { status: 400 }
      );
    }

    const priceId = plan === 'yearly'
      ? process.env.STRIPE_YEARLY_PRICE_ID
      : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      console.error(`Missing price ID for plan: ${plan}`);
      return NextResponse.json(
        { error: 'Price not configured', message: 'Please contact support' },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription?canceled=true`,
        customer_email: user.email,
        metadata: {
          userId: session.user.id,
          plan,
        },
      });

      // Send email notification (non-blocking)
      if (process.env.EMAIL_USER) {
        const html = `
          <h2>New Subscription Attempt</h2>
          <p><strong>User:</strong> ${user.name || 'Unknown'} (${user.email})</p>
          <p><strong>Plan:</strong> ${plan}</p>
          <p><strong>Amount:</strong> ${plan === 'yearly' ? '₹9,999/year' : '₹999/month'}</p>
          <p>Checkout URL: ${checkoutSession.url}</p>
        `;

        try {
          await sendEmail(process.env.EMAIL_USER, 'New Subscription Attempt', html);
        } catch (emailError) {
          console.error('Email notification failed (non-blocking):', emailError);
          // Don't fail the request
        }
      }

      return NextResponse.json({ url: checkoutSession.url });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      return NextResponse.json(
        { error: 'Failed to create checkout session', details: stripeError instanceof Error ? stripeError.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Subscription create error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}