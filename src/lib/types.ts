export const IMPULSE_DURATION = 7.6;
export const REFERENCE_TIME = 0.35;

export type BackgroundStatus =
  | 'running'
  | 'settled'
  | 'paused'
  | 'reduced'
  | 'lost'
  | 'fallback';

export type BackgroundController = {
  readonly paused: boolean;
  setSpeed(value: number): void;
  setIntensity(value: number): void;
  setFocus(value: number): void;
  setAperture(value: number): void;
  toggle(): void;
  seek(value: number): void;
  replay(): void;
  dispose(): void;
};
