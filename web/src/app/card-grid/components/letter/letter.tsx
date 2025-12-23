'use client';

import { motion } from 'motion/react';
import { observer } from 'mobx-react-lite';

import { cn } from '@utils';

import { TIdName } from '@models';
import { TLettersStore } from '@card-grid/store';

import styles from './letter.module.css';

type Props = {
  item: TIdName<string>;
  store: TLettersStore;
};

export const Letter = observer(({ item, store }: Props) => {
  const isSelected = store.isSelected(item);

  const onPick = () => {
    store.toggle(item);
  };

  return (
    <motion.button
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
      onClick={onPick}
      className={cn(
        styles.letter,
        'rounded-md text-[1.05rem] sm:text-[1.2rem] md:text-[1.35rem] text-white/90 mx-0.5 my-0.5 sm:mx-1 sm:my-1',
        isSelected ? 'ring-2 ring-sky-500/80 ring-offset-0 ring-offset-transparent' : 'ring-0',
        isSelected ? styles.selected : '',
        'cursor-pointer opacity-100'
      )}
    >
      {item.name}
    </motion.button>
  );
});
