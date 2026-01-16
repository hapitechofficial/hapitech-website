'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BackButton from '@/components/BackButton';

interface User {
  subscription: {
    status: string;
    planId: string;
  } | null;
}

export default function SubscriptionClient({ user }: { user: User | null }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

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
    setIsLoading(true);
    try {
      // Step 1: Create order on backend
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!data.orderId || !data.keyId) {
        alert('Error creating subscription order');
        setIsLoading(false);
        return;
      }

      // Step 2: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway');
        setIsLoading(false);
        return;
      }

      // Step 3: Open Razorpay checkout
      const options: any = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'hApItech',
        description: `${plan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription - 15 posters/day`,
        prefill: {
          name: data.userName || '',
          email: data.userEmail || '',
        },
        theme: {
          color: '#FF6B9D',
        },
        handler: async (response: any) => {
          // Step 4: Verify payment on backend
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
              // Payment successful
              router.push('/dashboard/subscription?success=true');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Error creating subscription. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <BackButton />
        <h1 className="text-4xl font-bold text-charcoal mb-8">Subscription</h1>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">Subscription activated successfully!</p>
          </div>
        )}

        {canceled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-600">Subscription was canceled.</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          {user?.subscription?.status === 'active' ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Premium Active</h2>
              <p className="text-charcoal">Your {user.subscription.planId} subscription is active.</p>
              <p className="text-charcoal mt-2">Enjoy unlimited poster generations!</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-charcoal mb-6 text-center">Choose Your Plan</h2>

              <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-charcoal mb-2">Monthly Plan</h3>
                  <p className="text-3xl font-bold text-magenta mb-4">₹1,500<span className="text-lg">/month</span></p>
                  <ul className="space-y-2 mb-6">
                    <li>✓ 15 posters per day</li>
                    <li>✓ Priority support</li>
                    <li>✓ Commercial usage</li>
                    <li>✓ High-resolution downloads</li>
                  </ul>
                  <button
                    onClick={() => handleSubscribe('monthly')}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange to-magenta text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Subscribe Monthly'}
                  </button>
                </div>

                <div className="border border-magenta rounded-lg p-6 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-magenta text-white px-3 py-1 rounded-full text-sm">
                    Best Value
                  </div>
                  <h3 className="text-xl font-semibold text-charcoal mb-2">Yearly Plan</h3>
                  <p className="text-3xl font-bold text-magenta mb-4">₹15,000<span className="text-lg">/year</span></p>
                  <p className="text-green-600 font-semibold mb-4">Save ₹3,000!</p>
                  <ul className="space-y-2 mb-6">
                    <li>✓ 15 posters per day</li>
                    <li>✓ Priority support</li>
                    <li>✓ Commercial usage</li>
                    <li>✓ High-resolution downloads</li>
                  </ul>
                  <button
                    onClick={() => handleSubscribe('yearly')}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-orange to-magenta text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Subscribe Yearly'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}