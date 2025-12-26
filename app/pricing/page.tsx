import { Metadata } from 'next';
import { Video, Image, Music, Code, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing - hApItech AI Marketing Services',
  description: 'Transparent pricing for our AI-powered marketing services. Get started with affordable, high-quality solutions.',
};

const pricingPlans = [
  {
    icon: Video,
    title: 'Video Ads',
    price: '₹1,500/-',
    features: [
      'AI-generated video content',
      'Custom branding integration',
      'Multiple format options',
      'High-quality rendering',
      'Quick turnaround time',
    ],
  },
  {
    icon: Image,
    title: 'Poster Ads',
    price: '₹100/-',
    features: [
      'AI-designed poster layouts',
      'Brand color matching',
      'High-resolution output',
      'Multiple size variants',
      'Instant delivery',
    ],
  },
  {
    icon: Music,
    title: 'Song / Jingle Creation',
    price: '₹500/-',
    features: [
      'Original melody composition',
      'Lyrics customization',
      'Professional recording',
      'Multiple format delivery',
      'Copyright included',
    ],
  },
  {
    icon: Code,
    title: 'Website or Personal AI Tool Development',
    price: 'Custom Quote',
    features: [
      'Tailored development approach',
      'Modern tech stack',
      'Responsive design',
      'SEO optimization',
      'Ongoing support',
    ],
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          Transparent Pricing
        </h1>
        <p className="text-xl text-center text-charcoal mb-12 max-w-2xl mx-auto">
          Affordable AI-powered marketing solutions that deliver exceptional results without breaking the bank.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <plan.icon className="w-12 h-12 text-magenta mr-4" />
                <div>
                  <h3 className="text-2xl font-semibold text-charcoal">{plan.title}</h3>
                  <div className="text-3xl font-bold text-orange mt-2">
                    {plan.price}
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-charcoal">
                    <Check className="w-5 h-5 text-teal mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="/contact"
                className="mt-8 bg-gradient-to-r from-orange to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 inline-block w-full text-center"
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-charcoal mb-4">Need a Custom Solution?</h2>
          <p className="text-charcoal mb-6">
            For larger projects or custom requirements, we offer personalized quotes tailored to your specific needs.
          </p>
          <a
            href="/contact"
            className="bg-teal text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300 inline-block"
          >
            Contact Us for Quote
          </a>
        </div>
      </div>
    </div>
  );
}