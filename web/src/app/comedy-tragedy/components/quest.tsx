'use client';

import { useRouter } from 'next/navigation';

import { TQuestStore } from '@/app/comedy-tragedy/store/quest.store';
import { AnswerInput } from './answer-input';
import { ComedyImg } from './comedy-img';
import { TragedyImg } from './tragedy-img/tragedy-img';
import { AudioPlayer } from './audio-player';
import { SUCCESS_ANIMATION_DURATION_SEC, TRACKS } from '@comedy-tragedy/config';
import { observer } from 'mobx-react-lite';
import { EQuestState } from '@models';
import { motion } from 'motion/react';
import { useEffect } from 'react';

type TProps = {
  store: TQuestStore;
};

export const Quest = observer(({ store }: TProps) => {
  const router = useRouter();

  const onTrackSet = (index: number) => {
    const answer = TRACKS[index].word;
    store.setExpectedAnswer(answer);
  };

  const isError = store.state === EQuestState.Error;
  const isSolved = store.state === EQuestState.Solved;

  // useEffect(() => {
  //   if (!isSolved) return;
  //   const id = window.setTimeout(() => {
  //     router.push(EPage.WhoAreYou);
  //   }, SUCCESS_ANIMATION_DURATION_SEC * 1000);
  //   return () => clearTimeout(id);
  // }, [isSolved, router]);

  return (
    <div className="relative z-10 flex flex-col gap-6 items-center w-full max-w-5xl px-4">
      <AudioPlayer onTrackSet={onTrackSet} />

      <div className="w-full flex flex-col items-center justify-center gap-6 pt-10">
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: isSolved ? 20 : 1, opacity: isSolved ? 0 : 1 }}
          transition={{
            duration: SUCCESS_ANIMATION_DURATION_SEC,
            ease: 'linear',
          }}
          style={{ originX: 0.5, originY: 0.5 }} // увеличивает от центра
        >
          {isError ? <TragedyImg /> : <ComedyImg />}
        </motion.div>
      </div>

      <motion.div
        className="w-full"
        initial={{ opacity: 1 }}
        animate={{ opacity: isSolved ? 0 : 1 }}
        transition={{
          duration: SUCCESS_ANIMATION_DURATION_SEC,
          ease: 'linear',
        }}
        style={{ originX: 0.5, originY: 0.5 }} // увеличивает от центра
      >
        <AnswerInput store={store} />
      </motion.div>
    </div>
  );
});
