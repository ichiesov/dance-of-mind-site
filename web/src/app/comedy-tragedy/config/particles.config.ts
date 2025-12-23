import { TParticlesConfig } from '@models/particles';

export const PARTICLES = {
  minSize: 0.6,
  maxSize: 1.4,
  color: '#FFFFFF',
  defaultSpeed: 3.2,
  defaultDensity: 120,
  errorSpeed: 10,
  successSpeed: 12,
  successDensity: 200,
};

export const PARTICLES_DEFAULT: TParticlesConfig = {
  direction: 'none',
  speed: 3.2,
  density: 120,
};

export const PARTICLES_ERROR: TParticlesConfig = {
  ...PARTICLES_DEFAULT,
  speed: 10,
};

export const PARTICLES_SUCCESS: TParticlesConfig = {
  ...PARTICLES_DEFAULT,
  direction: 'inside',
  speed: 40,
  density: 200,
};
