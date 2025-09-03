'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user needs to complete profile after email verification
    if (user && user.isEmailVerified && !user.isProfileComplete) {
      // Only redirect if not already on profile page
      if (pathname !== '/profile') {
        router.push('/profile?complete=true');
      }
    }
  }, [user, router, pathname]);

  return <>{children}</>;
}