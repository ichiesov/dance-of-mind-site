'use client';

import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { clamp, randBetween } from '@utils';
import { TSize } from '@models';

import { CARD_SIZE } from '@who-are-you/config';

type Props = { viewport: TSize };

export function FloatingCard({ viewport }: Props) {
  // Инициализация случайных параметров один раз
  const random = useMemo(() => {
    return {
      // Стартовые позиции в процентах экрана — позже конвертируем в px
      startXPct: Math.random(),
      startYPct: Math.random(),
      // В какую сторону идём сначала по каждой оси
      dirX: Math.random() < 0.5 ? -1 : 1,
      dirY: Math.random() < 0.5 ? -1 : 1,
      // Продолжительность анимации по осям (сек)
      durX: randBetween(14, 28),
      durY: randBetween(18, 34),
      // Небольшая случайная задержка, чтобы не синхронизировались
      delay: randBetween(0, 4),
    } as const;
  }, []);

  // Когда знаем размеры окна — считаем диапазоны и старт
  const { initialX, initialY, targetX, targetY } = useMemo(() => {
    const xMax = Math.max(0, viewport.w - CARD_SIZE.w);
    const yMax = Math.max(0, viewport.h - CARD_SIZE.h);
    const startX = clamp(Math.round(random.startXPct * xMax), 0, xMax);
    const startY = clamp(Math.round(random.startYPct * yMax), 0, yMax);
    const tx = random.dirX < 0 ? 0 : xMax;
    const ty = random.dirY < 0 ? 0 : yMax;
    return { initialX: startX, initialY: startY, targetX: tx, targetY: ty };
  }, [viewport, random]);

  // Пока не знаем размеры окна — ничего не анимируем (избегаем прыжков)
  const ready = viewport.w > 0 && viewport.h > 0;

  return (
    <motion.div
      className="absolute"
      style={{ width: CARD_SIZE.w, height: CARD_SIZE.h }}
      initial={ready ? { x: initialX, y: initialY } : false}
      animate={{
        x: [initialX, targetX],
        y: [initialY, targetY],
      }}
      transition={{
        delay: random.delay,
        x: { duration: random.durX, repeat: Infinity, repeatType: 'mirror', ease: 'linear' },
        y: { duration: random.durY, repeat: Infinity, repeatType: 'mirror', ease: 'linear' },
      }}
    >
      <motion.div
        className="w-full h-full rounded-xl"
        style={{
          // 3D поведение как в CSS
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          // Заглушка-обложка из public/images/cards
          backgroundImage: 'url(/images/cards/placeholder.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          overflow: 'hidden',
        }}
        animate={{
          rotateX: [0, 5, -5, 0],
          rotateY: [0, -8, 8, 0],
          rotateZ: [0, 2, -2, 0],
        }}
        transition={{
          duration: 16,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'mirror',
          times: [0, 0.33, 0.66, 1],
        }}
      />
    </motion.div>
  );
}
