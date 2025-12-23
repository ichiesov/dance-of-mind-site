'use client';

import { SparklesCore } from '@/components/ui/sparkles';
import { useQuestLocalStore } from '@/app/comedy-tragedy/store';
import { useEffect, useState } from 'react';
import { Quest } from '@/app/comedy-tragedy/components/quest';
import {
  PARTICLES,
  PARTICLES_DEFAULT,
  PARTICLES_ERROR,
  PARTICLES_SUCCESS,
} from '@comedy-tragedy/config';
import { EQuestState, TParticlesConfig } from '@models';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';

const ComedyTragedyPage = observer(function ComedyTragedyPageInner() {
  const questStore = useQuestLocalStore();

  const [particlesState, setParticlesState] = useState<TParticlesConfig>(PARTICLES_DEFAULT);

  const onChangeState = (state: EQuestState) => {
    switch (state) {
      case EQuestState.Default:
        setParticlesState(PARTICLES_DEFAULT);
        break;
      case EQuestState.Error:
        setParticlesState(PARTICLES_ERROR);
        break;
      case EQuestState.Solved:
        setParticlesState(PARTICLES_SUCCESS);
        break;
    }
  };

  useEffect(() => {
    const dispose = reaction(() => questStore.state, onChangeState, {
      equals: (prev, next) => prev === next,
    });

    return () => dispose();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-x-hidden">
      <div className="w-full absolute inset-0">
        <SparklesCore
          id="tsparticles-comedy-tragedy"
          background="transparent"
          minSize={PARTICLES.minSize}
          maxSize={PARTICLES.maxSize}
          speed={particlesState.speed}
          particleDensity={particlesState.density}
          particleDirection={particlesState.direction}
          className="w-full h-full"
          particleColor={PARTICLES.color}
        />
      </div>

      <Quest store={questStore} />
    </div>
  );
});

export default ComedyTragedyPage;
