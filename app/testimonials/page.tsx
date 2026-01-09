'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import FeedbackForm from '@/components/FeedbackForm';

interface Feedback {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  rating: number;
  createdAt: string;
}

export default function Testimonials() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/feedback');
      const data = await response.json();

      if (data.success) {
        setFeedbacks(data.data);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedbackSuccess = () => {
    setShowFeedbackForm(false);
    fetchFeedbacks();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige via-white to-beige dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          User Feedback & Testimonials
        </h1>
        <p className="text-lg md:text-xl text-center text-charcoal dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Real experiences from our valued users. Share your feedback and help us grow!
        </p>

        {/* Feedback Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="bg-gradient-to-r from-orange to-magenta text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <MessageSquare size={20} />
            Share Your Experience
          </button>
        </div>

        {/* Feedback Form Modal */}
        {showFeedbackForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto p-6 md:p-8 relative">
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
              >
                ✕
              </button>
              <h2 className="text-3xl font-bold text-charcoal dark:text-white mb-2">
                Share Your Feedback
              </h2>
              <p className="text-charcoal dark:text-gray-300 mb-6">
                We'd love to hear about your experience with hApItech. Your feedback helps us improve and serve you better!
              </p>
              <FeedbackForm onSuccess={handleFeedbackSuccess} />
            </div>
          </div>
        )}

        {/* Feedbacks Display */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-charcoal dark:text-gray-300">
              <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading feedbacks...</p>
            </div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-charcoal dark:text-gray-300 mb-4">
              No feedback yet. Be the first to share your experience!
            </p>
            <button
              onClick={() => setShowFeedbackForm(true)}
              className="text-magenta font-semibold hover:text-orange transition-colors"
            >
              Share Your Feedback Now →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-orange"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < feedback.rating
                          ? 'fill-orange text-orange'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Feedback Message */}
                <p className="text-charcoal dark:text-gray-200 mb-4 leading-relaxed italic">
                  "{feedback.message}"
                </p>

                {/* User Info */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="font-semibold text-charcoal dark:text-white">
                    {feedback.name}
                  </div>
                  {feedback.company && (
                    <div className="text-sm text-teal dark:text-teal/80 font-medium">
                      {feedback.company}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formatDate(feedback.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {feedbacks.length > 0 && (
          <div className="text-center mt-16">
            <p className="text-lg text-charcoal dark:text-gray-300 mb-6">
              Ready to transform your marketing with hApItech?
            </p>
            <a
              href="/contact"
              className="bg-gradient-to-r from-orange to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 inline-block"
            >
              Get Started Today
            </a>
          </div>
        )}
      </div>
    </div>
  );
}