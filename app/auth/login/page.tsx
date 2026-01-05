import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';
import BackButton from '@/components/BackButton';

export const metadata: Metadata = {
  title: 'Login - hApItech',
  description: 'Access your hApItech account to manage projects and AI tools.',
};

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-orange/5 to-magenta/5 flex items-center justify-center px-4 py-8 sm:py-0">
      <div className="max-w-md w-full">
        <BackButton />
        <LoginForm />
      </div>
    </div>
  );
}