import { Metadata } from 'next';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | hApItech',
  description: 'Find answers to common questions about hApItech\'s AI marketing services, pricing, and processes.',
};

export default function FAQ() {

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-center text-charcoal mb-12 max-w-2xl mx-auto">
          Got questions? We've got answers. Find everything you need to know about our AI-powered marketing services.
        </p>

        <FAQAccordion />

        <div className="text-center mt-12">
          <p className="text-lg text-charcoal mb-6">
            Still have questions? We're here to help!
          </p>
          <a
            href="/contact"
            className="bg-gradient-to-r from-orange to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300 inline-block"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}