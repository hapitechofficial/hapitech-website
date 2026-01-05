import { Metadata } from 'next';
import SignupForm from '@/components/SignupForm';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Sign Up - hApItech',
  description: 'Create your hApItech account to access AI-powered marketing tools and services.',
};

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-orange/5 to-magenta/5 flex items-center justify-center px-4 py-8 sm:py-0">
      <div className="max-w-md w-full">
        <BackButton />
        <SignupForm />
      </div>
    </div>
  );
}