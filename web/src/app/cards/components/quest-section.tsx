'use client';

import { CardFace } from '@cards/components/card-face';
import { Letter } from '@cards/components/letter/letter';
import { useLettersStore } from '@cards/store';
import { useKeyboardShortcut } from '@hooks';
import { observer } from 'mobx-react-lite';
import { motion } from 'motion/react';
import { useEffect } from 'react';

type Props = {
  layoutId: string;
  questId: string;

  onExit: () => void;
  onSolved: (questId: string) => void;
};

export const QuestSection = observer(({ layoutId, questId, onExit, onSolved }: Props) => {
  const store = useLettersStore({ questId, onSolved });

  useKeyboardShortcut({
    key: 'Escape',
    onKeyPressed: () => onExit(),
  });

  useEffect(() => {
    setTimeout(() => store.reshuffle(), 300);
  }, [store]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-3 sm:py-4">
        <motion.div
          layoutId={layoutId}
          onClick={(e) => e.stopPropagation()}
          transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
        >
          <CardFace />
        </motion.div>

        <motion.section
          layout
          className="z-40 flex flex-wrap items-center justify-center gap-1 px-3 py-2 bg-black/55 backdrop-blur-sm rounded-md"
          transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
        >
          {store.letters.map((item) => (
            <Letter key={item.id} item={item} store={store} />
          ))}
        </motion.section>
      </div>
    </div>
  );
});
