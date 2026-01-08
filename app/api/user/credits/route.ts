import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('Credits API: User not authenticated');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please sign in to access your credits' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        credits: true,
        subscription: {
          select: { status: true }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isSubscribed = user.subscription?.status === 'active';

    return NextResponse.json({
      credits: user.credits,
      isSubscribed
    });
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}