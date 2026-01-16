'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // Create order
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'monthly' }),
      });

      const data = await response.json();

      if (!data.orderId || !data.keyId) {
        alert('Error creating subscription order');
        setIsLoading(false);
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway');
        setIsLoading(false);
        return;
      }

      // Open Razorpay checkout
      const options: any = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'hApItech',
        description: 'Monthly Subscription - 15 posters/day',
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
                plan: 'monthly',
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Reload page to refresh subscription status
              onClose();
              window.location.reload();
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setIsLoading(false);
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

          <h2 className="text-2xl font-bold text-charcoal mb-2">Upgrade to Pro</h2>
          <p className="text-gray-600 mb-6">
            You've used your free credits! Get unlimited poster generation with our Pro plan.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-charcoal">₹1,500</div>
              <div className="text-sm text-gray-600">per month</div>
              <div className="text-sm text-gray-600">15 posters per day</div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-magenta rounded-full"></div>
              <span className="text-sm">15 posters per day generation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-magenta rounded-full"></div>
              <span className="text-sm">High-resolution downloads</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-magenta rounded-full"></div>
              <span className="text-sm">Priority support</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-magenta rounded-full"></div>
              <span className="text-sm">Commercial usage rights</span>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange to-magenta text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Subscribe Now - ₹1,500/month'}
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Secure payment powered by Razorpay. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}