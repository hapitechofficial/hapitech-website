'use client';

import { X } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  if (!isOpen) return null;

  const handleSubscribe = () => {
    // TODO: Integrate with Stripe
    alert('Subscription functionality will be implemented with Stripe integration');
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
              <div className="text-sm text-gray-600">Unlimited access</div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-magenta rounded-full"></div>
              <span className="text-sm">Unlimited poster generation</span>
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
            className="w-full bg-gradient-to-r from-orange to-magenta text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Subscribe Now - ₹1,500/month
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Secure payment powered by Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}