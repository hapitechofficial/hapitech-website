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

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating subscription');
      }
    } catch (error) {
      alert('Error creating subscription');
    } finally {
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
                  <p className="text-3xl font-bold text-magenta mb-4">₹999<span className="text-lg">/month</span></p>
                  <ul className="space-y-2 mb-6">
                    <li>✓ 5 posters per day</li>
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
                  <p className="text-3xl font-bold text-magenta mb-4">₹9,999<span className="text-lg">/year</span></p>
                  <p className="text-green-600 font-semibold mb-4">Save 2 months!</p>
                  <ul className="space-y-2 mb-6">
                    <li>✓ 5 posters per day</li>
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