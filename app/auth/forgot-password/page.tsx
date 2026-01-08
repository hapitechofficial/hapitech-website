import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - hApItech',
  description: 'Reset your hApItech account password.',
};

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-orange/10 to-orange/5 flex items-center justify-center px-4 py-8 sm:py-0">
      <div className="max-w-md w-full">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}