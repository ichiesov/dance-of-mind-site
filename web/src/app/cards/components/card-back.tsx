'use client';

import Image from 'next/image';
import { CometCard } from '@/components/ui/comet-card';
import { cn } from '@utils';

import cardPlaceholder from 'images/cards/back.svg';

import './card-animated-border.scss';

type Props = {
  isTarget: boolean;
};

export const CardBack = ({ isTarget }: Props) => {
  return (
    <div className={cn('w-full perspective-distant transform-3d')}>
      <CometCard
        rotateDepth={12}
        translateDepth={12}
        className={cn('w-full cursor-pointer select-none')}
      >
        <div className="relative w-full" style={{ aspectRatio: '250 / 350' }}>
          <Image
            src={cardPlaceholder}
            alt={'Playing card back'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={false}
          />
          {isTarget && (
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-0 rounded-[16px] shadow-none',
                'card-animated-border'
              )}
            />
          )}
        </div>
      </CometCard>
    </div>
  );
};
