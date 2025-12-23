'use client';

import { SparklesCore } from '@/components/ui/sparkles';

import { observer } from 'mobx-react-lite';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { useViewportSize } from '@hooks';
import { PARTICLES } from '@comedy-tragedy/config';
import { FloatingCard, FloatingWordsLayer } from '@who-are-you/components';

const WhoIAmPage = observer(function WhoIAmPageInner() {
  const viewport = useViewportSize();

  // Количество визуальных карточек во 2 слое (без текста)
  const cardsCount = 54;

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* 1 слой — частицы */}
      <div className="w-full absolute inset-0 z-0 pointer-events-none">
        <SparklesCore
          id="tsparticles-who-i-am"
          background="transparent"
          minSize={PARTICLES.minSize}
          maxSize={PARTICLES.maxSize}
          speed={PARTICLES.defaultSpeed}
          particleDensity={PARTICLES.defaultDensity}
          className="w-full h-full"
          particleColor={PARTICLES.color}
        />
      </div>

      {/* 2 слой — летающие карточки с мягким 3D-вращением */}
      {/* <div className="absolute inset-0 z-10 pointer-events-none">
        {Array.from({ length: cardsCount }).map((_, i) => (
          <FloatingCard key={`fc-${i}`} viewport={viewport} />
        ))}
      </div> */}

      {/* Центральный текстовый вопрос */}
      <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
        <TextGenerateEffect words="Кто ты?" className="text-center" />
      </div>

      {/* 3 слой — парящие слова из стора (кликабельные). Делаем выше прочего. */}
      <FloatingWordsLayer viewport={viewport} />

      {/* Контентный контейнер (если понадобится) */}
      <div className="relative z-30 flex flex-col items-center w-full max-w-5xl px-4" />
    </div>
  );
});

export default WhoIAmPage;
