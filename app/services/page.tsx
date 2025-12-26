import { Metadata } from 'next';
import { Video, Image, Music, Code } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Services - hApItech AI Marketing Solutions',
  description: 'Explore our AI-powered marketing services: Video Ads, Poster Ads, Song Creation, and Website Development.',
};

const services = [
  {
    icon: Video,
    title: 'Video Ads',
    description: 'Create engaging video advertisements with AI-powered tools that bring your brand story to life.',
    price: '₹1,500/-',
  },
  {
    icon: Image,
    title: 'Poster Ads',
    description: 'Design eye-catching posters that capture attention and convey your message effectively.',
    price: '₹100/-',
  },
  {
    icon: Music,
    title: 'Song / Jingle Creation',
    description: 'Craft memorable audio content that resonates with your audience and strengthens brand recall.',
    price: '₹500/-',
  },
  {
    icon: Code,
    title: 'Website or Personal AI Tool Development',
    description: 'Build custom websites and AI tools tailored to your specific needs and business goals.',
    price: 'Depends on the work or content',
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          Our Services
        </h1>
        <p className="text-xl text-center text-charcoal mb-12 max-w-2xl mx-auto">
          Leverage AI-powered creativity to elevate your marketing efforts with our comprehensive range of services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <service.icon className="w-12 h-12 text-magenta mr-4" />
                <h3 className="text-2xl font-semibold text-charcoal">{service.title}</h3>
              </div>
              <p className="text-charcoal mb-6 leading-relaxed">{service.description}</p>
              <div className="text-2xl font-bold text-orange">
                Starting at {service.price}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-charcoal mb-6">
            Ready to transform your marketing with AI-powered creativity?
          </p>
          <a
            href="/contact"
            className="bg-gradient-to-r from-orange to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300 inline-block"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </div>
  );
}