export type TrackItem = { src: string; word: string };

export const TRACKS: TrackItem[] = [
  { src: 'audio/1.mp3', word: 'голова' },
  { src: 'audio/2.mp3', word: 'теперь' },
  { src: 'audio/3.mp3', word: 'сердце' },
  { src: 'audio/4.mp3', word: 'пусто' },
  { src: 'audio/5.mp3', word: 'готово' },
  { src: 'audio/6.mp3', word: 'одиночество' },
  { src: 'audio/7.mp3', word: 'взятка' },
  { src: 'audio/8.mp3', word: 'хвост' },
];

export const TRACK_INTERVAL_DURATION = 60 * 1000; // 1 min
