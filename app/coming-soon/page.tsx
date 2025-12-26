import { Metadata } from 'next';
import { Sparkles, Video, Image, Music, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Coming Soon - AI Tools | hApItech',
  description: 'Discover the exciting AI tools coming soon from hApItech: AI Poster Generator, AI Video Ad Maker, and AI Song Generator.',
};

const comingSoonTools = [
  {
    icon: Image,
    title: 'AI Poster Generator',
    description: 'Create stunning, professional posters in seconds with our advanced AI. Simply describe your vision, and watch as AI transforms your ideas into eye-catching designs perfect for marketing campaigns, events, and social media.',
    features: [
      'Instant poster generation',
      'Brand color integration',
      'Multiple style options',
      'High-resolution output',
      'Social media optimization',
    ],
  },
  {
    icon: Video,
    title: 'AI Video Ad Maker',
    description: 'Revolutionary video creation tool that produces engaging advertisements automatically. From script writing to final editing, our AI handles every aspect of video production while maintaining your brand voice.',
    features: [
      'Automated script generation',
      'AI voiceover synthesis',
      'Visual effects and transitions',
      'Multi-platform formatting',
      'Real-time performance analytics',
    ],
  },
  {
    icon: Music,
    title: 'AI Song Generator',
    description: 'Compose original songs and jingles tailored to your brand. Our AI music creation tool generates melodies, harmonies, and lyrics that capture your brand essence and create memorable audio experiences.',
    features: [
      'Custom melody composition',
      'Lyrics generation',
      'Genre adaptation',
      'Professional mixing',
      'Copyright-ready music',
    ],
  },
];

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
            Future of AI Marketing
          </h1>
          <p className="text-xl text-charcoal max-w-2xl mx-auto">
            We're working on groundbreaking AI tools that will revolutionize how you create marketing content.
            Stay tuned for these exciting developments!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {comingSoonTools.map((tool, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <div className="bg-orange text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Rocket className="w-4 h-4 mr-1" />
                  COMING SOON
                </div>
              </div>

              <div className="flex items-center mb-6">
                <tool.icon className="w-12 h-12 text-magenta mr-4" />
                <h3 className="text-2xl font-semibold text-charcoal">{tool.title}</h3>
              </div>

              <p className="text-charcoal mb-6 leading-relaxed">{tool.description}</p>

              <ul className="space-y-2">
                {tool.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-charcoal">
                    <Sparkles className="w-4 h-4 text-teal mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-magenta to-orange rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Be the First to Know</h2>
          <p className="text-xl mb-6">
            Join our waitlist to get early access to these revolutionary AI tools and exclusive updates on our development progress.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-charcoal focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-magenta px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-100 transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}