import { CARDS, CARDS_TOTAL_COUNT } from '@card-grid/config';
import { useLocalObservable } from 'mobx-react-lite';

const createLocalStore = () => ({
  target: '2-of-clubs',
  activeQuest: '',
  solvedCards: new Set<string>(),

  isTarget(cardId: string) {
    return this.target === cardId;
  },

  isSolved(cardId: string) {
    return this.solvedCards.has(cardId);
  },

  setActiveQuest(cardId: string) {
    this.activeQuest = cardId;
  },

  nextTarget() {
    if (this.solvedCards.size >= CARDS_TOTAL_COUNT) {
      return;
    }

    this.activeQuest = '';

    // Выбираем следующий таргет случайно из не открытых
    const available = CARDS.filter((c) => !this.solvedCards.has(c));
    const rnd = Math.floor(Math.random() * available.length);
    this.target = available[rnd];
  },
});

export type TCardsStore = ReturnType<typeof createLocalStore>;

export const useCardsStore = () => {
  return useLocalObservable(() => createLocalStore());
};
