import { useLocalObservable } from 'mobx-react-lite';

import { norm } from '@utils';
import { ERROR_ANIMATION_DURATION } from '@comedy-tragedy/config';
import { EQuestState } from '@models';

export type TQuestStore = {
  expectedAnswer: string;

  state: EQuestState;
  setExpectedAnswer: (val: string) => void;
  checkAnswer: (val: string) => void;
};

const createLocalStore = (): TQuestStore => ({
  expectedAnswer: '',
  state: EQuestState.Default,

  // actions
  setExpectedAnswer: function (val: string) {
    console.log('expected answer', val);
    this.expectedAnswer = val;
  },
  checkAnswer: function (val: string) {
    if (norm(val) === norm(this.expectedAnswer)) {
      this.state = EQuestState.Solved;
    } else {
      this.state = EQuestState.Error;
      setTimeout(() => {
        this.state = EQuestState.Default;
      }, ERROR_ANIMATION_DURATION);
    }
  },
});

export const useQuestLocalStore = () => {
  return useLocalObservable(() => createLocalStore());
};
