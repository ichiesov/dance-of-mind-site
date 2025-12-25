'use client';

import { useAuthErrorHandler } from '@/hooks/use-auth-error-handler';
import { ReactNode } from 'react';

interface AuthErrorProviderProps {
  children: ReactNode;
}

export function AuthErrorProvider({ children }: AuthErrorProviderProps) {
  useAuthErrorHandler();
  return <>{children}</>;
}
