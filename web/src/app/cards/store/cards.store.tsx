import { CARDS, CARDS_TOTAL_COUNT } from '@cards/config';
import { useLocalObservable } from 'mobx-react-lite';
import { apiClient } from '@/lib/api';

const createLocalStore = () => ({
  target: '2-of-clubs',
  activeQuest: '',
  solvedCards: new Set<string>(),
  isLoading: false,

  isTarget(cardId: string) {
    return this.target === cardId;
  },

  isSolved(cardId: string) {
    //console.log('CHECK SOLVED', cardId, this.solvedCards.has(cardId));
    return this.solvedCards.has(cardId);
  },

  setActiveQuest(cardId: string) {
    this.activeQuest = cardId;
  },

  async loadProgress() {
    try {
      this.isLoading = true;
      const progress = await apiClient.getProgress();

      // Инициализируем solvedCards из загруженного прогресса
      this.solvedCards = new Set(progress.completed_quests);

      // Выбираем первый таргет среди не решенных карт
      this.nextTarget();
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      this.isLoading = false;
    }
  },

   markAsSolved(cardId: string) {
    // Проверяем, что карта еще не решена
    if (this.solvedCards.has(cardId)) {
      return;
    }

    this.solvedCards.add(cardId);
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
