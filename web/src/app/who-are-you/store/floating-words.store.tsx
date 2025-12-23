'use client';

import { createContext, useContext } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import { observable } from 'mobx';
import { OTHER_WORDS, REQUIRED_WORDS } from '@who-are-you/config';
import { norm } from '@utils';

export type TWhoIAmCard = {
  id: string;
  text: string;
};

function generateCards(): TWhoIAmCard[] {
  const required: TWhoIAmCard[] = REQUIRED_WORDS.map((w, idx) => ({
    id: `required-${idx + 1}`,
    text: w,
  }));

  const fillers: TWhoIAmCard[] = OTHER_WORDS.map((w, i) => ({
    id: `card-${i + 1}`,
    text: w,
  }));

  return [...required, ...fillers];
}

const createLocalStore = () => {
  return {
    cards: REQUIRED_WORDS.map((w, idx) => ({ id: `required-${idx + 1}`, text: w })),
    selectedIds: observable.set<string>(),
    sequenceProgress: 0,
    isSolved: false,

    init: function () {
      // Генерация случайных карточек только на клиенте после маунта
      if (typeof window !== 'undefined') {
        this.cards = generateCards();
      }
    },

    pickWord: function (card: TWhoIAmCard) {
      const wasSelected = this.selectedIds.has(card.id);

      if (wasSelected) {
        this.selectedIds.delete(card.id);
        // На снятие выбора прогресс не двигаем
        return;
      }

      // На выбор карточки добавляем в Set и проверяем прогресс фразы
      this.selectedIds.add(card.id);

      const word = card.text.trim().toLowerCase();
      const expected = REQUIRED_WORDS[this.sequenceProgress];

      if (norm(word) === norm(expected)) {
        this.sequenceProgress += 1;
      } else {
        // Если ошиблись — начинать заново, но если клик совпадает с первым словом,
        // то прогресс становится 1, иначе 0
        this.sequenceProgress = word === REQUIRED_WORDS[0] ? 1 : 0;
      }

      if (this.sequenceProgress >= REQUIRED_WORDS.length) {
        this.isSolved = true;
      }
    },

    isSelected: function (cardId: string) {
      return this.selectedIds.has(cardId);
    },

    isTarget: function (word: string) {
      return REQUIRED_WORDS.includes(word.trim().toLowerCase());
    },
  };
};

export const useWhoIAmLocalStore = () => {
  return useLocalObservable(() => createLocalStore());
};

export type TFloatingWordsStore = ReturnType<typeof createLocalStore>;
export const FloatingWordsContext = createContext<TFloatingWordsStore | null>(null);
export const useFloatingWordsStore = () => {
  const store = useContext(FloatingWordsContext);
  if (!store) throw new Error('FloatingWordsContext not found');
  return store;
};
