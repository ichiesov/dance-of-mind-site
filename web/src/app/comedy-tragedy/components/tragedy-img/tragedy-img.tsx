import Image from 'next/image';
import { cn } from '@utils';
import { useEffect } from 'react';
import { useAudioPlayer } from 'react-use-audio-player';

import styles from './tragedy-img.module.css';
import tragedyImg from 'images/tragedy.webp';

export const TragedyImg = () => {
  const { load, pause } = useAudioPlayer();

  useEffect(() => {
    load('audio/error.wav', {
      initialVolume: 1,
      autoplay: true,
    });

    return () => pause();
  }, []);

  return (
    <div className={styles.rage}>
      <div className={styles['mask-wrap']}>
        <Image
          className={cn(styles['mask-image'], styles.on)}
          src={tragedyImg}
          alt={'Tragedy'}
          width={320}
          height={570}
          priority
        />
      </div>
      <div className={styles['hit-overlay']} />
    </div>
  );
};
