import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await request.json(); // 'monthly' or 'yearly'

    const priceId = plan === 'yearly'
      ? process.env.STRIPE_YEARLY_PRICE_ID
      : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured' }, { status: 500 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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
      customer_email: user.email!,
      metadata: {
        userId: session.user.id,
        plan,
      },
    });

    // Send email notification
    const html = `
      <h2>New Subscription Attempt</h2>
      <p><strong>User:</strong> ${user.name} (${user.email})</p>
      <p><strong>Plan:</strong> ${plan}</p>
      <p><strong>Amount:</strong> ${plan === 'yearly' ? '₹9,999/year' : '₹999/month'}</p>
      <p>Checkout URL: ${checkoutSession.url}</p>
    `;

    await sendEmail(process.env.EMAIL_USER!, 'New Subscription Attempt', html);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Subscription create error:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}