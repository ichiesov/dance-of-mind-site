'use client';

import { useRef, useState } from 'react';

import { CARDS } from '@card-grid/config';
import { useCardsStore } from '@card-grid/store';

import { cn } from '@utils';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

import { QuestSection } from '@card-grid/components/quest-section';
import { observer } from 'mobx-react-lite';
import { Card } from '@card-grid/components/Card';

export const CardsGrid = observer(() => {
  const store = useCardsStore();

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleClick = (cardId: string) => {
    setSelectedCardId(cardId);

    store.nextTarget();
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);

  //useAutoScroll(scrollRef, `card-${store.currentTargetIdx}`);

  const handleCardReveal = (cardId: string) => {
    store.setActiveQuest(cardId);
  };

  const handleQuestSolve = (questId: string) => {
    console.log('SOLVE QUEST', questId);
    store.nextTarget();
  };

  const handleQuestExit = () => {
    store.setActiveQuest('');
  };

  return (
    <LayoutGroup>
      <div className="relative w-full h-full">
        <section
          ref={scrollRef}
          className="min-h-0 h-full overflow-y-auto grid gap-2 sm:gap-3 grid-cols-[repeat(13,minmax(0,1fr))] grid-rows-4"
        >
          {CARDS.map((cardId) => (
            <div key={cardId}>
              {/* <motion.div
                onClick={() => handleClick(cardId)}
                className={cn(
                  'relative rounded-xl h-full w-full',
                  isSelected(cardId) ? 'opacity-0 pointer-events-none' : ''
                )}
                layoutId={cardId}
                transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
              >
                <CardBack isTarget={store.isTarget(cardId)} />
              </motion.div> */}
              <Card
                cardId={cardId}
                isTarget={store.isTarget(cardId)}
                onRevealed={handleCardReveal}
              />
            </div>
          ))}
        </section>

        <AnimatePresence>
          {store.activeQuest && (
            <>
              {/* Backdrop over grid; grid remains visible beneath */}
              <motion.div
                aria-hidden
                className={cn(
                  'absolute inset-0 z-30 w-full h-full bg-black/50 backdrop-blur-[1px] pointer-events-none'
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Centered quest container that the card flies into */}
              <motion.div
                className={cn('absolute inset-0 z-40 flex items-center justify-center p-4')}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <QuestSection
                  layoutId={store.activeQuest}
                  questId={store.activeQuest}
                  onExit={handleQuestExit}
                  onSolved={handleQuestSolve}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
});
