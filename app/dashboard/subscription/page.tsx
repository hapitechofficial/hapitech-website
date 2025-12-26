import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SubscriptionClient from '@/components/SubscriptionClient';

export const metadata: Metadata = {
  title: 'Subscription - hApItech Dashboard',
  description: 'Manage your hApItech subscription and billing.',
};

export default async function Subscription() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div>Please sign in</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscription: {
        select: { status: true, planId: true },
      },
    },
  });

  return <SubscriptionClient user={user} />;
}