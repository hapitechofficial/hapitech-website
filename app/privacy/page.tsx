import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - hApItech',
  description: 'Learn how hApItech protects your privacy and handles your personal information.',
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <div className="prose prose-lg max-w-none text-charcoal">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you contact us, request services, or communicate with us.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information to provide services, communicate with you, improve our services, and comply with legal obligations.</p>

            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>

            <h2>4. Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

            <h2>5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>

            <h2>6. Cookies</h2>
            <p>We may use cookies to enhance your experience on our website. You can control cookie settings through your browser.</p>

            <h2>7. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

            <h2>8. Contact Us</h2>
            <p>If you have any questions about this privacy policy, please contact us at hapitechofficial@gmail.com.</p>

            <p className="text-sm text-gray-600 mt-8">
              Last updated: December 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}