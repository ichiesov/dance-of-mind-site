'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticationError } from '@/lib/auth-error';
import { TokenStorage } from '@/lib/token-storage';

export function useAuthErrorHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthError = (event: CustomEvent) => {
      TokenStorage.clearTokens();
      router.push('/auth');
    };

    window.addEventListener('auth-error' as any, handleAuthError);

    return () => {
      window.removeEventListener('auth-error' as any, handleAuthError);
    };
  }, [router]);

  return {
    handleError: (error: unknown) => {
      if (isAuthenticationError(error)) {
        TokenStorage.clearTokens();
        router.push('/auth');
      }
    },
  };
}

export function emitAuthError() {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('auth-error');
    window.dispatchEvent(event);
  }
}
