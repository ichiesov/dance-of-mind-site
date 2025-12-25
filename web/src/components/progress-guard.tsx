'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface ProgressGuardProps {
  children: (progress: string[]) => React.ReactNode;
}

export function ProgressGuard({ children }: ProgressGuardProps) {
  const [progress, setProgress] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiClient.getProgress();
        setProgress(response.completed_quests);
      } catch (err) {
        console.error('Failed to load progress:', err);
        setError('Не удалось загрузить прогресс');
        // В случае ошибки инициализируем пустым массивом
        setProgress([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, []);

  // Показываем loader пока загружается прогресс
  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Загрузка прогресса...</div>
      </div>
    );
  }

  // Показываем ошибку если не удалось загрузить
  if (error && progress === null) {
    return (
      <div className="min-h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  // Рендерим children с прогрессом
  return <>{children(progress || [])}</>;
}
