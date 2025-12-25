'use client';

import Image from 'next/image';

import wallImg from 'images/wall.webp';
import { CardsGrid } from '@cards/components';
import { ProgressGuard } from '@/components/progress-guard';

export default function Page() {
  return (
    <ProgressGuard>
      {(progress) => (
        <div className="h-screen w-screen overflow-y-hidden overflow-x-auto bg-cover bg-center bg-no-repeat">
          <Image src={wallImg} alt="Cover Image" className="object-cover" fill />

          <main className="w-full h-full min-w-[1280px] px-2 sm:px-4 py-2 sm:py-4">
            <CardsGrid initialProgress={progress} />
          </main>
        </div>
      )}
    </ProgressGuard>
  );
}
