import { Metadata } from 'next';
import { Video, Image, Music } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Portfolio - hApItech Creative Work Samples',
  description: 'Explore our portfolio of AI-generated marketing content including videos, posters, and audio creations.',
};

const portfolioItems = [
  {
    type: 'Video Ad',
    title: 'Tech Startup Launch Campaign',
    description: 'Dynamic video advertisement for a cutting-edge tech startup featuring AI-generated animations and compelling storytelling.',
    icon: Video,
    category: 'Video Ads',
  },
  {
    type: 'Poster',
    title: 'E-commerce Product Promotion',
    description: 'Eye-catching poster design for online retail products with vibrant colors and modern typography.',
    icon: Image,
    category: 'Poster Ads',
  },
  {
    type: 'Jingle',
    title: 'Brand Identity Song',
    description: 'Catchy jingle composition that captures the essence of a luxury fashion brand with memorable melody and lyrics.',
    icon: Music,
    category: 'Audio Content',
  },
  {
    type: 'Video Ad',
    title: 'Health & Wellness Campaign',
    description: 'Inspirational video series promoting healthy lifestyle choices with calming visuals and motivational messaging.',
    icon: Video,
    category: 'Video Ads',
  },
  {
    type: 'Poster',
    title: 'Event Announcement',
    description: 'Bold poster design for a major corporate event featuring sleek graphics and clear call-to-action elements.',
    icon: Image,
    category: 'Poster Ads',
  },
  {
    type: 'Jingle',
    title: 'Product Launch Tune',
    description: 'Upbeat jingle for a new product release that creates excitement and brand recall through rhythmic composition.',
    icon: Music,
    category: 'Audio Content',
  },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          Our Portfolio
        </h1>
        <p className="text-xl text-center text-charcoal mb-12 max-w-2xl mx-auto">
          Discover the power of AI-driven creativity through our diverse collection of marketing masterpieces.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-magenta to-orange flex items-center justify-center">
                <item.icon className="w-16 h-16 text-white" />
              </div>
              <div className="p-6">
                <div className="text-sm text-teal font-semibold mb-2">{item.category}</div>
                <h3 className="text-xl font-semibold text-charcoal mb-3">{item.title}</h3>
                <p className="text-charcoal text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-charcoal mb-6">
            Ready to create something amazing together?
          </p>
          <a
            href="/contact"
            className="bg-gradient-to-r from-orange to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300 inline-block"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </div>
  );
}