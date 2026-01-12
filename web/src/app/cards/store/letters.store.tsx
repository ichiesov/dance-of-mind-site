import { useLocalObservable } from 'mobx-react-lite';
import { shuffle, splitToLetters } from '@utils';
import { TIdName } from '@models';

import { QUEST_CONFIG, QUEST_PHRASE } from '@cards/config';

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

const createLocalStore = (
  questId: string,
  isSolved: boolean,
  onSolved: (questId: string) => void
) => {
  const letters = getLetters(QUEST_PHRASE);
  const required = new Set(splitToLetters(QUEST_CONFIG));

  const buildSelected = () => {
    if (!isSolved) {
      return new Map<string, string>();
    }

    const arr: [string, string][] = Array.from(required.values()).map((letter) => {
      const item = letters.find(({ id, name }) => name === letter);
      return [item!.id, item!.name];
    });

    return new Map(arr);
  };

  const selected = buildSelected();

  return {
    letters,
    required,
    selected,
    onSolved: onSolved,

    isSelected(item: TIdName<string>) {
      return this.selected.has(item.id);
    },

    toggle(item: TIdName<string>) {
      const { id, name } = item;

      if (this.selected.has(id)) {
        this.selected.delete(id);
      } else {
        this.selected.set(id, name);
      }

      this.checkSolved();
    },

    reshuffle() {
      this.letters = shuffle(this.letters);
      this.selected.clear();
    },

    checkSolved() {
      const selectedLetters = new Set(this.selected.values());

      const isAllRequiredSelected = this.required.values().every((k) => selectedLetters.has(k));

      if (!isAllRequiredSelected) {
        return;
      }

      this.onSolved(questId);
    },
  };
};

export type TLettersStore = ReturnType<typeof createLocalStore>;

export const useLettersStore = ({
  questId,
  isSolved,
  onSolved,
}: {
  questId: string;
  isSolved: boolean;
  onSolved: (questId: string) => void;
}) => {
  return useLocalObservable(() => createLocalStore(questId, isSolved, onSolved));
};
