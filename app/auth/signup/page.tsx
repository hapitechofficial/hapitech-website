import { Metadata } from 'next';
import SignupForm from '@/components/SignupForm';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Sign Up - hApItech',
  description: 'Create your hApItech account to access AI-powered marketing tools and services.',
};

export default function Signup() {
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <BackButton />
        <SignupForm />
      </div>
    </div>
  );
}