'use client';

import { Suspense } from 'react';
import ResetPasswordForm from '@/components/ResetPasswordForm';

function ResetPasswordContent() {
  return (
    <div className="min-h-screen max-md:bg-white dark:max-md:bg-gray-950 sm:bg-gradient-to-br sm:from-beige sm:via-orange/10 sm:to-orange/5 flex items-center justify-center px-4 py-8 sm:py-0">
      <div className="max-w-md w-full">
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={
      <div className="min-h-screen max-md:bg-white dark:max-md:bg-gray-950 sm:bg-gradient-to-br sm:from-beige sm:via-orange/10 sm:to-orange/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal dark:max-md:text-white">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}