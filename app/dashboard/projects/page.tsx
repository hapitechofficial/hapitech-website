import { Metadata } from 'next';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Projects - hApItech Dashboard',
  description: 'View and manage your hApItech projects.',
};

export default function Projects() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <BackButton />
        <h1 className="text-4xl font-bold text-charcoal mb-8">My Projects</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-charcoal text-center">
            Project management functionality will be implemented with the database integration.
          </p>
        </div>
      </div>
    </div>
  );
}