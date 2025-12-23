'use client';

import { TQuestStore } from '@/app/comedy-tragedy/store/quest.store';
import { EQuestState } from '@models';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';

type Props = {
  store: TQuestStore;
};

const AnswerInputImpl = ({ store }: Props) => {
  const [val, setVal] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const isError = store.state === EQuestState.Error;

  const focusOnReset = (state: EQuestState) => {
    if (state === EQuestState.Default) {
      setVal('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  useEffect(() => {
    focusOnReset(store.state);
  }, [store.state]);

  return (
    <div className="w-full pt-6 pb-10">
      <div className="mx-auto w-full max-w-md">
        <input
          ref={inputRef}
          className="w-full rounded-md border border-white/30 bg-black/40 text-white placeholder:text-white/50 px-4 py-3 outline-none focus:ring-2 focus:ring-white/50"
          value={val}
          disabled={isError}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') store.checkAnswer(val);
          }}
          aria-label="Ответ"
        />
      </div>
    </div>
  );
};

export const AnswerInput = observer(AnswerInputImpl);
