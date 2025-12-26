import { Metadata } from 'next';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Profile - hApItech Dashboard',
  description: 'Manage your hApItech account profile and settings.',
};

export default function Profile() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <BackButton />
        <h1 className="text-4xl font-bold text-charcoal mb-8">Profile Settings</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-charcoal text-center">
            Profile management functionality will be implemented with the authentication system.
          </p>
        </div>
      </div>
    </div>
  );
}