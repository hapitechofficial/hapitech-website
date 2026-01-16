import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment system unavailable' },
        { status: 503 }
      );
    }

    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, plan } = await request.json();

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature || !plan) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const data = razorpayOrderId + '|' + razorpayPaymentId;
    const hash = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(data)
      .digest('hex');

    if (hash !== razorpaySignature) {
      console.error('[VERIFY PAYMENT] Signature verification failed');
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (!payment || payment.status !== 'captured') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Update subscription in database
    const subscription = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        status: 'active',
        planId: plan,
        razorpayId: razorpayPaymentId as any,
        razorpayOrderId: razorpayOrderId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        status: 'active',
        planId: plan,
        razorpayId: razorpayPaymentId as any,
        razorpayOrderId: razorpayOrderId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000),
      },
    });

    // Send confirmation email
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true },
    });

    if (user && process.env.EMAIL_USER) {
      const html = `
        <h2>Subscription Activated</h2>
        <p><strong>User:</strong> ${user.name} (${user.email})</p>
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Amount:</strong> ${plan === 'yearly' ? '₹15,000/year' : '₹1,500/month'}</p>
        <p><strong>Payment ID:</strong> ${razorpayPaymentId}</p>
        <p>Subscription is now active! You can now generate up to 15 posters per day.</p>
      `;

      try {
        await sendEmail(process.env.EMAIL_USER, `Subscription Activated: ${plan}`, html);
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Don't fail the response if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscription: {
        status: subscription.status,
        planId: subscription.planId,
      },
    });
  } catch (error) {
    console.error('[VERIFY PAYMENT] Error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
