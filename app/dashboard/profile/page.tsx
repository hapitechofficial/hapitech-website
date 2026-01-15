'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BackButton from '@/components/BackButton';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <BackButton />
        <h1 className="text-4xl font-bold text-charcoal mb-8">Profile Settings</h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* User Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-charcoal mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <p className="text-charcoal font-medium">{session.user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                <p className="text-charcoal font-medium">{session.user.name || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Profile Avatar */}
          {session.user.image && (
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-600 mb-2">Profile Picture</label>
              <img
                src={session.user.image}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}

          {/* Logout Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}