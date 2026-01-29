'use client';

import { useRouter } from 'next/navigation';
import { Image, Video, Music, Rocket } from 'lucide-react';
import BackButton from '@/components/BackButton';

const tools = [
  {
    icon: Image,
    title: 'hApItech Production Suite',
    description: 'Cinematic poster creation for luxury & professional brands',
    status: 'Available',
    href: '/tools/poster-generator',
  },
  {
    icon: Video,
    title: 'AI Video Ad Maker',
    description: 'Generate engaging video advertisements',
    status: 'Coming Soon',
  },
  {
    icon: Music,
    title: 'AI Song Generator',
    description: 'Compose original songs and jingles',
    status: 'Coming Soon',
  },
];

export default function Tools() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <BackButton href="/" />
        <h1 className="text-4xl font-bold text-charcoal mb-8 mt-4">AI Tools</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-6 text-center ${
                tool.status === 'Available' ? 'hover:shadow-xl cursor-pointer transition-shadow' : ''
              }`}
              onClick={() => tool.status === 'Available' && tool.href && router.push(tool.href)}
            >
              <tool.icon className="w-12 h-12 text-magenta mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal mb-2">{tool.title}</h3>
              <p className="text-charcoal text-sm mb-4">{tool.description}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1 ${
                tool.status === 'Available'
                  ? 'bg-green-500 text-white'
                  : 'bg-orange text-white'
              }`}>
                <Rocket className="w-4 h-4" />
                {tool.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
