import { RefObject, useEffect } from 'react';

export const useAutoScroll = (scrollRef: RefObject<HTMLDivElement | null>, targetId: string) => {
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const el = container.querySelector<HTMLDivElement>(`#${targetId}`);
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [targetId, scrollRef]);
};
