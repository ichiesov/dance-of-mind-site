import { useLocalObservable } from 'mobx-react-lite';
import { shuffle, splitToLetters } from '@utils';
import { TIdName } from '@models';

import { QUEST_CONFIG, QUEST_PHRASE } from '@card-grid/config';

const getLetters = (source?: string): TIdName<string>[] => {
  if (!source) {
    return [];
  }

  const splitted = splitToLetters(source);
  const shuffled = shuffle(splitted);
  return shuffled.map((name, i) => ({
    id: `ltr-${i}-${name}`,
    name,
  }));
};

const createLocalStore = (questId: string, onSolved: (questId: string) => void) => ({
  letters: getLetters(QUEST_PHRASE),
  required: new Set(splitToLetters(QUEST_CONFIG)),
  selectedIds: new Set<string>(),
  selectedLetters: new Set<string>(),
  onSolved: onSolved,

  isSelected(item: TIdName<string>) {
    return this.selectedIds.has(item.id);
  },

  toggle(item: TIdName<string>) {
    const { id, name } = item;

    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
      this.selectedLetters.delete(name);
    } else {
      this.selectedIds.add(id);
      this.selectedLetters.add(name);
    }

    this.checkSolved();
  },

  reshuffle() {
    this.letters = shuffle(this.letters);
    this.selectedIds.clear();
    this.selectedLetters.clear();
  },

  checkSolved() {
    const isAllRequiredSelected = this.required.values().every((k) => this.selectedLetters.has(k));

    if (!isAllRequiredSelected) {
      return;
    }

    this.onSolved(questId);
  },
});

export type TLettersStore = ReturnType<typeof createLocalStore>;

export const useLettersStore = ({
  questId,
  onSolved,
}: {
  questId: string;
  onSolved: (questId: string) => void;
}) => {
  return useLocalObservable(() => createLocalStore(questId, onSolved));
};
