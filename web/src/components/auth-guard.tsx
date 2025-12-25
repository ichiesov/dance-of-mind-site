'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TokenStorage } from '@/lib/token-storage';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Пропускаем страницу авторизации
      if (pathname === '/auth') {
        setIsChecking(false);
        return;
      }

      // Проверяем наличие валидного токена
      const hasValidToken = TokenStorage.hasValidAccessToken();

      if (!hasValidToken) {
        // Если токена нет - редирект на /auth
        router.push('/auth');
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Показываем loader во время проверки авторизации
  if (isChecking) {
    return (
      <div className="min-h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Проверка авторизации...</div>
      </div>
    );
  }

  return <>{children}</>;
}
