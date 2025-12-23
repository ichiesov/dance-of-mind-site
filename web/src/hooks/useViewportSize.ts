'use client';

import { TSize } from '@models';
import { useEffect, useState } from 'react';

export function useViewportSize(): TSize {
  const [vp, setVp] = useState<TSize>({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return vp;
}
