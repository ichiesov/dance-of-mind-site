import Image from 'next/image';

import { cn } from '@utils';

import cardFace from 'images/cards/placeholder.svg';

export const CardFace = () => {
  return (
    <div className="relative aspect-[7/10] h-[40vh] sm:h-[46vh] md:h-[52vh] lg:h-[56vh] xl:h-[60vh]">
      <div className={cn('relative w-full h-full perspective-distant transform-3d')}>
        <Image src={cardFace} alt={'Playing card face'} fill />
      </div>
    </div>
  );
};
