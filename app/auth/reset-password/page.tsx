import { Metadata } from 'next';
import ResetPasswordForm from '@/components/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password - hApItech',
  description: 'Set a new password for your hApItech account.',
};

export default function ResetPassword() {
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <ResetPasswordForm />
      </div>
    </div>
  );
}