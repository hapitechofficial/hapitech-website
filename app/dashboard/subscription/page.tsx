'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import BackButton from '@/components/BackButton';
import { Check } from 'lucide-react';

interface UserSubscription {
  status: string;
  planId: string | null;
  credits: number;
}

const plans = [
  {
    name: 'Free',
    price: 'Free',
    features: [
      '5 posters per month',
      'Basic customization',
      'Standard support',
    ],
    buttonText: 'Current Plan',
    buttonDisabled: true,
  },
  {
    name: 'Premium',
    price: '$9.99/month',
    features: [
      'Unlimited posters',
      'Advanced customization',
      'Priority support',
      'Download HD posters',
      'Commercial use rights',
    ],
    buttonText: 'Upgrade',
    buttonDisabled: false,
  },
];

export default function Subscription() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchSubscription();
    }
  }, [session]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscription');
      if (response.ok) {
        const data = await response.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading subscription...</p>
      </div>
    );
  }

  const isSubscribed = subscription?.status === 'active';

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <BackButton />
        <h1 className="text-4xl font-bold text-charcoal mb-4">Subscription &amp; Billing</h1>
        <p className="text-gray-600 mb-12">Manage your subscription and unlock unlimited poster generation</p>

        {/* Credits Display */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-charcoal mb-4">Your Credits</h2>
          <p className="text-3xl font-bold text-magenta mb-4">{subscription?.credits || 0} Credits</p>
          <p className="text-gray-600">Use credits to generate posters. Each poster uses 1 credit.</p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-lg p-8 ${
                isSubscribed && index === 1
                  ? 'bg-magenta text-white border-2 border-magenta'
                  : 'bg-white text-charcoal'
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.buttonDisabled || (isSubscribed && index === 1)}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.buttonDisabled || (isSubscribed && index === 1)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : `${
                        isSubscribed && index === 1
                          ? 'bg-white text-magenta hover:bg-gray-100'
                          : 'bg-magenta text-white hover:bg-opacity-90'
                      }`
                }`}
              >
                {isSubscribed && index === 1 ? 'Current Plan' : plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}