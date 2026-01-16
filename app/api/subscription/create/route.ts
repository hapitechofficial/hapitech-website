import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

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

    // Guard: If Razorpay not configured, return helpful error
    if (!razorpay || !process.env.RAZORPAY_KEY_ID) {
      console.warn('[SUBSCRIPTION] Razorpay not configured');
      return NextResponse.json(
        { error: 'Payment system unavailable', message: 'Subscription service is temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    const { plan } = await request.json(); // 'monthly' or 'yearly'
    console.log('[SUBSCRIPTION] Creating order for plan:', plan, 'User:', session.user.id);

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      console.warn('[SUBSCRIPTION] Invalid plan:', plan);
      return NextResponse.json(
        { error: 'Invalid plan', message: 'Plan must be monthly or yearly' },
        { status: 400 }
      );
    }

    // Prices in paisa (100 paisa = 1 rupee)
    const amounts = {
      monthly: 150000, // ₹1,500
      yearly: 1500000, // ₹15,000
    };

    const amount = amounts[plan as keyof typeof amounts];

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
      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount: amount, // in paisa
        currency: 'INR',
        receipt: `order_${session.user.id}_${Date.now()}`,
        notes: {
          userId: session.user.id,
          plan: plan,
          userEmail: user.email,
          userName: user.name || 'Unknown',
        },
      });

      console.log('[SUBSCRIPTION] Order created:', order.id);

      // Send email notification (non-blocking)
      if (process.env.EMAIL_USER) {
        const html = `
          <h2>New Subscription Attempt</h2>
          <p><strong>User:</strong> ${user.name || 'Unknown'} (${user.email})</p>
          <p><strong>Plan:</strong> ${plan}</p>
          <p><strong>Amount:</strong> ${plan === 'yearly' ? '₹15,000/year' : '₹1,500/month'}</p>
          <p><strong>Razorpay Order ID:</strong> ${order.id}</p>
        `;

        try {
          await sendEmail(process.env.EMAIL_USER, 'New Subscription Attempt', html);
        } catch (emailError) {
          console.error('Email notification failed (non-blocking):', emailError);
          // Don't fail the request
        }
      }

      return NextResponse.json({ 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        userName: user.name,
        userEmail: user.email,
        plan: plan,
        userId: session.user.id,
      });
    } catch (razorpayError) {
      console.error('[SUBSCRIPTION] Razorpay error:', razorpayError);
      return NextResponse.json(
        { error: 'Failed to create payment order', details: razorpayError instanceof Error ? razorpayError.message : 'Unknown error' },
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
