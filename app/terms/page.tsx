import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - hApItech',
  description: 'Read our terms and conditions for using hApItech services and website.',
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          Terms & Conditions
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <div className="prose prose-lg max-w-none text-charcoal">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using hApItech services, you accept and agree to be bound by the terms and provision of this agreement.</p>

            <h2>2. Services</h2>
            <p>hApItech provides AI-powered marketing content creation services including video ads, poster design, audio content, and custom development.</p>

            <h2>3. Payment Terms</h2>
            <p>Payment is due upon completion of services unless otherwise agreed. All fees are non-refundable once work has commenced.</p>

            <h2>4. Intellectual Property</h2>
            <p>Upon full payment, clients receive full rights to use the delivered content for their business purposes.</p>

            <h2>5. Revisions</h2>
            <p>We provide up to 3 rounds of revisions. Additional revisions may incur extra charges.</p>

            <h2>6. Limitation of Liability</h2>
            <p>hApItech shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>

            <h2>7. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Palanpur.</p>

            <p className="text-sm text-gray-600 mt-8">
              Last updated: December 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}