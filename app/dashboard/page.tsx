import { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, FileText, CreditCard, Settings, Sparkles } from 'lucide-react';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Dashboard - hApItech',
  description: 'Manage your hApItech projects, subscription, and access AI tools.',
};

const dashboardItems = [
  {
    title: 'AI Tools',
    description: 'Access our suite of AI-powered marketing tools',
    href: '/dashboard/tools',
    icon: Sparkles,
    status: 'Coming Soon',
  },
  {
    title: 'My Projects',
    description: 'View and manage your creative projects',
    href: '/dashboard/projects',
    icon: FileText,
    status: null,
  },
  {
    title: 'Subscription',
    description: 'Manage your subscription and billing',
    href: '/dashboard/subscription',
    icon: CreditCard,
    status: null,
  },
  {
    title: 'Profile Settings',
    description: 'Update your account information',
    href: '/dashboard/profile',
    icon: Settings,
    status: null,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <BackButton />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Welcome to Your Dashboard</h1>
          <p className="text-xl text-charcoal">Manage your projects and access AI-powered tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 block"
            >
              <div className="flex items-center mb-4">
                <item.icon className="w-8 h-8 text-magenta mr-3" />
                {item.status && (
                  <span className="bg-orange text-white px-2 py-1 rounded text-xs font-semibold">
                    {item.status}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">{item.title}</h3>
              <p className="text-charcoal text-sm">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-charcoal mb-6">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">0</div>
              <div className="text-charcoal">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal mb-2">0</div>
              <div className="text-charcoal">AI Generations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange mb-2">Free</div>
              <div className="text-charcoal">Current Plan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}