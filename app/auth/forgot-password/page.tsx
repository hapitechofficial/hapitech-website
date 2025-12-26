import { Metadata } from 'next';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password - hApItech',
  description: 'Reset your hApItech account password.',
};

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}