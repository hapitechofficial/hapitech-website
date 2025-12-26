'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset - placeholder
    console.log('Password reset request for:', email);
    setIsSubmitted(true);
    alert('Password reset functionality will be implemented with authentication system.');
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-2">Check your email</h1>
          <p className="text-charcoal mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-magenta hover:text-orange font-semibold"
            >
              try again
            </button>
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center text-magenta hover:text-orange font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">Reset your password</h1>
        <p className="text-charcoal">Enter your email address and we'll send you a link to reset your password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange to-magenta text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
        >
          <Mail className="w-5 h-5 mr-2" />
          Send reset link
        </button>
      </form>

      <div className="text-center mt-6">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-magenta hover:text-orange font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}