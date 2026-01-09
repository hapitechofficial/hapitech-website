'use client';

import { useState } from 'react';
import { Star, Send } from 'lucide-react';

interface FeedbackFormProps {
  onSuccess?: () => void;
}

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    rating: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!formData.message.trim()) {
      setError('Feedback message is required');
      setIsLoading(false);
      return;
    }

    if (formData.message.trim().length < 10) {
      setError('Please write at least 10 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          company: formData.company.trim() || null,
          message: formData.message.trim(),
          rating: formData.rating,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          message: '',
          rating: 5,
        });
        onSuccess?.();
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-green-600 dark:text-green-400 font-medium">
            ✓ Thank you! Your feedback has been received. We appreciate your experience!
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-charcoal dark:text-gray-200 mb-2"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta focus:border-transparent bg-white dark:bg-gray-800 text-charcoal dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isLoading}
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-charcoal dark:text-gray-200 mb-2"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta focus:border-transparent bg-white dark:bg-gray-800 text-charcoal dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isLoading}
          />
        </div>

        {/* Company */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-charcoal dark:text-gray-200 mb-2"
          >
            Company (Optional)
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Your company name"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta focus:border-transparent bg-white dark:bg-gray-800 text-charcoal dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isLoading}
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-charcoal dark:text-gray-200 mb-3">
            How would you rate your experience? *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: star,
                  }))
                }
                className="transition-transform hover:scale-110"
                disabled={isLoading}
              >
                <Star
                  size={32}
                  className={`${
                    star <= formData.rating
                      ? 'fill-orange text-orange'
                      : 'text-gray-300 dark:text-gray-600'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-charcoal dark:text-gray-200 mb-2"
          >
            Your Feedback *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Share your experience with hApItech. What did you like? What can we improve? (minimum 10 characters)"
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta focus:border-transparent bg-white dark:bg-gray-800 text-charcoal dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formData.message.length} characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-orange to-magenta text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
        >
          <Send size={18} />
          {isLoading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
