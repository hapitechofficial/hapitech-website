'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<'monthly' | 'yearly' | null>(null);

  if (!isOpen) return null;

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
        console.error('[SUBSCRIPTION] Create order failed:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
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
        console.error('[SUBSCRIPTION] Failed to load Razorpay script');
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
              console.log('[SUBSCRIPTION] Payment verified successfully');
              onClose();
              window.location.reload();
            } else {
              console.error('[SUBSCRIPTION] Payment verification failed:', verifyData);
              alert(`Payment verification failed: ${verifyData.error || 'Please contact support.'}`);
              setLoadingPlan(null);
            }
          } catch (error) {
            console.error('[SUBSCRIPTION] Verification error:', error);
            alert('Payment verification failed. Please contact support.');
            setLoadingPlan(null);
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
      console.error('[SUBSCRIPTION] Error creating subscription:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to create subscription. Please try again.'}`);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange to-magenta rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⭐</span>
          </div>

          <h2 className="text-2xl font-bold text-charcoal mb-2">Upgrade Your Plan</h2>
          <p className="text-gray-600 mb-6">
            You've used your free credits! Choose a plan to continue generating amazing posters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Pro Plan */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-charcoal mb-2">Pro Plan</h3>
              <div className="text-3xl font-bold text-magenta mb-2">₹1,500</div>
              <div className="text-sm text-gray-600 mb-4">per month</div>
              
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-magenta rounded-full"></div>
                  <span>15 posters/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-magenta rounded-full"></div>
                  <span>HD downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-magenta rounded-full"></div>
                  <span>Priority support</span>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe('monthly')}
                disabled={loadingPlan !== null}
                className="w-full bg-gradient-to-r from-orange to-magenta text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50 text-sm"
              >
                {loadingPlan === 'monthly' ? 'Processing...' : 'Get Pro'}
              </button>
            </div>

            {/* Platinum Plan */}
            <div className="bg-gradient-to-br from-magenta to-pink-500 rounded-lg p-4 transform scale-105 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-charcoal px-3 py-1 rounded-full text-xs font-bold">
                BEST VALUE
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">Platinum Plan</h3>
              <div className="text-3xl font-bold text-white mb-2">₹15,000</div>
              <div className="text-sm text-yellow-200 mb-2">per year</div>
              <div className="text-xs text-yellow-200 mb-4 font-semibold">Save ₹3,000!</div>
              
              <div className="space-y-2 mb-4 text-sm text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>15 posters/day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>HD downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Priority support</span>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe('yearly')}
                disabled={loadingPlan !== null}
                className="w-full bg-white text-magenta py-2 px-4 rounded-lg font-bold hover:bg-yellow-100 transition-all disabled:opacity-50 text-sm"
              >
                {loadingPlan === 'yearly' ? 'Processing...' : 'Get Platinum'}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Secure payment powered by Razorpay. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}