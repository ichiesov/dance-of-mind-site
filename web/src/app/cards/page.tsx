import Image from 'next/image';

import wallImg from 'images/wall.webp';
import { CardsGrid } from '@cards/components';
import { LayoutGrid } from '@/components/ui/layout-grid';

export default function Page() {
  const phrase = 'я твой голос внутри';

  return (
    <div className="h-screen w-screen overflow-y-hidden overflow-x-auto bg-cover bg-center bg-no-repeat">
      <Image src={wallImg} alt="Cover Image" className="object-cover" fill />

      <main className="w-full h-full min-w-[1280px] px-2 sm:px-4 py-2 sm:py-4">
        <CardsGrid />

        {/* <LayoutGrid cards={cards} /> */}
      </main>
    </div>
  );
}
