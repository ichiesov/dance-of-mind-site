'use client';

import { SyntheticEvent, useEffect, useRef, useState } from 'react';

import { CARDS } from '@cards/config';
import { useCardsStore, useLettersStore } from '@cards/store';

import { cn } from '@utils';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';

import { observer } from 'mobx-react-lite';
import { Card } from '@cards/components/Card';

import { apiClient } from '@/lib/api';
import { CardFace } from '@cards/components/card-face';
import { Letter } from '@cards/components/letter/letter';

interface CardsGridProps {
  initialProgress: string[];
}

export const CardsGrid = observer(({ initialProgress }: CardsGridProps) => {
  const store = useCardsStore({ solvedCardsIds: initialProgress });

  const scrollRef = useRef<HTMLDivElement | null>(null);

  //useAutoScroll(scrollRef, `card-${store.currentTargetIdx}`);

  const handleCardReveal = (cardId: string) => {
    store.setActiveQuest(cardId);
  };

  const handleQuestSolve = async (questId: string) => {
    console.log('SOLVE QUEST', questId);

    // Повторно решенные карты скипаются
    if (store.isSolved(questId)) {
      store.setActiveQuest('');
      return;
    }

    // Отмечаем карту как решенную и сохраняем прогресс
    store.markAsSolved(questId);

    // Переходим к следующему таргету
    store.nextTarget();

    try {
      // Сохраняем на сервере
      await apiClient.saveProgress(questId);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
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
              <Card
                cardId={cardId}
                isTarget={store.isTarget(cardId)}
                isSolved={store.isSolved(cardId)}
                isActive={store.activeQuest === cardId}
                onRevealed={handleCardReveal}
              />
            </div>
          ))}
        </section>

        {!!store.activeQuest && (
          <Quest
            questId={store.activeQuest}
            isSolved={store.isSolved(store.activeQuest)}
            onSolved={async (id: string) => await handleQuestSolve(id)}
            onExit={handleQuestExit}
          />
        )}
      </div>
    </LayoutGroup>
  );
});

type QuestProps = {
  questId: string;
  isSolved: boolean;
  onSolved: (id: string) => void;
  onExit: () => void;
};

const Quest = observer(({ questId, isSolved, onSolved, onExit }: QuestProps) => {
  const store = useLettersStore({ questId, isSolved, onSolved });

  const cardRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLDivElement>(null);

  const onClickOutsideQuest = (e: SyntheticEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const containsCard = cardRef.current?.contains(target);
    const containsLetters = lettersRef.current?.contains(target);

    const containsQuest = containsCard || containsLetters;

    if (!containsQuest) {
      onExit();
    }
  };

  useEffect(() => {
    if (!isSolved) {
      setTimeout(() => store.reshuffle(), 300);
    }
  }, [store, isSolved]);

  return (
    <AnimatePresence>
      <div
        className={cn('absolute inset-0 z-30 w-full h-full bg-black/50 backdrop-blur-[1px]')}
        onClick={onClickOutsideQuest}
      >
        {/* Centered quest container that the card flies into */}
        <div className={cn('absolute inset-0 z-40 flex items-center justify-center p-4')}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 py-3 sm:py-4">
              <motion.div
                ref={cardRef}
                layoutId={questId}
                onClick={(e) => e.stopPropagation()}
                transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
              >
                <CardFace />
              </motion.div>

              <motion.section
                layout
                ref={lettersRef}
                className="z-40 flex flex-wrap items-center justify-center gap-1 px-3 py-2 bg-black/55 backdrop-blur-sm rounded-md"
                transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
              >
                {store.letters.map((item) => (
                  <Letter key={item.id} item={item} store={store} />
                ))}
              </motion.section>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
});
