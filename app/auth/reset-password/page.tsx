'use client';

import { Suspense } from 'react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

function ResetPasswordContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-orange/10 to-orange/5 flex items-center justify-center px-4 py-8 sm:py-0">
      <div className="max-w-md w-full">
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-beige via-orange/10 to-orange/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}