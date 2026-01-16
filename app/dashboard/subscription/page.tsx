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
    name: 'Pro',
    price: '₹1,500/month',
    features: [
      '15 posters per day',
      'Advanced customization',
      'Priority support',
      'Download HD posters',
      'Commercial use rights',
    ],
    buttonText: 'Subscribe Pro',
    buttonDisabled: false,
  },
  {
    name: 'Platinum',
    price: '₹15,000/year',
    features: [
      '15 posters per day',
      'Advanced customization',
      'Priority support',
      'Download HD posters',
      'Commercial use rights',
      'Save ₹3,000/year',
    ],
    buttonText: 'Get Platinum',
    buttonDisabled: false,
    mostValuable: true,
  },
];

export default function Subscription() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState<'monthly' | 'yearly' | null>(null);

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

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setLoadingPlan(plan);
    try {
      // Create order
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok || !data.orderId || !data.keyId) {
        console.error('[DASHBOARD] Create order failed:', {
          status: response.status,
          statusText: response.statusText,
          errorMessage: data.error || data.message,
          fullResponse: JSON.stringify(data, null, 2),
          hasOrderId: !!data.orderId,
          hasKeyId: !!data.keyId,
        });
        alert(`Error: ${data.error || data.message || 'Failed to create subscription order'}`);
        setLoadingPlan(null);
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway');
        setLoadingPlan(null);
        return;
      }

      // Open Razorpay checkout
      const options: any = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'hApItech',
        description: `${plan === 'monthly' ? 'Pro' : 'Platinum'} Subscription - 15 posters/day`,
        prefill: {
          name: data.userName || '',
          email: data.userEmail || '',
        },
        theme: {
          color: '#FF6B9D',
        },
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/subscription/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                plan: plan,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Reload page to refresh subscription status
              window.location.reload();
            } else {
              alert(`Payment verification failed: ${verifyData.error || 'Please contact support.'}`);
              setLoadingPlan(null);
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please contact support.');
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Subscription error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to create subscription. Please try again.'}`);
      setLoadingPlan(null);
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-lg p-8 flex flex-col transform transition-all duration-300 ${
                plan.mostValuable
                  ? 'bg-gradient-to-br from-magenta to-pink-500 text-white scale-105 -mt-4 shadow-2xl'
                  : isSubscribed && plan.name === 'Premium'
                  ? 'bg-magenta text-white'
                  : 'bg-white text-charcoal'
              }`}
            >
              {plan.mostValuable && (
                <div className="mb-4 inline-block bg-yellow-400 text-charcoal px-3 py-1 rounded-full text-sm font-bold w-fit">
                  ⭐ MOST VALUABLE
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={`text-3xl font-bold mb-6 ${plan.mostValuable ? 'text-white' : 'text-magenta'}`}>{plan.price}</p>
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  if (index === 1) handleSubscribe('monthly');
                  else if (index === 2) handleSubscribe('yearly');
                }}
                disabled={plan.buttonDisabled || (isSubscribed && index !== 0) || loadingPlan !== null}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  plan.buttonDisabled || (isSubscribed && index !== 0)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : plan.mostValuable
                    ? 'bg-white text-magenta hover:bg-yellow-100 font-bold'
                    : `${
                        isSubscribed && index === 1
                          ? 'bg-white text-magenta hover:bg-gray-100'
                          : 'bg-magenta text-white hover:bg-opacity-90'
                      }`
                }`}
              >
                {loadingPlan === 'monthly' && index === 1 ? 'Processing...' : loadingPlan === 'yearly' && index === 2 ? 'Processing...' : isSubscribed && index !== 0 ? 'Current Plan' : plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}