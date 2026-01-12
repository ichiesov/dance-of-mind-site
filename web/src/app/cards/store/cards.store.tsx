import { CARDS, CARDS_TOTAL_COUNT } from '@cards/config';
import { useLocalObservable } from 'mobx-react-lite';

const pickNext = (solved: Set<string>): string | null => {
  if (solved.size >= CARDS_TOTAL_COUNT) {
    return null;
  }

  const available = CARDS.filter((c) => !solved.has(c));
  const rnd = Math.floor(Math.random() * available.length);
  return available[rnd];
};

const createLocalStore = ({ solvedCardsIds }: Props) => {
  const solvedCards = new Set<string>(solvedCardsIds);
  const target = pickNext(solvedCards);

  return {
    target,
    activeQuest: '',
    solvedCards,

    isTarget(cardId: string) {
      return this.target === cardId;
    },

    isSolved(cardId: string) {
      return this.solvedCards.has(cardId);
    },

    setActiveQuest(cardId: string) {
      this.activeQuest = cardId;
    },

    markAsSolved(cardId: string) {
      // Проверяем, что карта еще не решена
      if (this.solvedCards.has(cardId)) {
        return;
      }

      this.solvedCards.add(cardId);
    },

    nextTarget() {
      const newTarget = pickNext(this.solvedCards);
      if (!newTarget) {
        return;
      }

      this.activeQuest = '';
      this.target = newTarget;
    },
  };
};

type Props = {
  solvedCardsIds: string[];
};

export const useCardsStore = (props: Props) => {
  return useLocalObservable(() => createLocalStore(props));
};
