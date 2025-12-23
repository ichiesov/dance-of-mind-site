export function randBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
