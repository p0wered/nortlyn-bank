export const IMPULSE_DURATION = 7.6;
export const REFERENCE_TIME = 0.35;

export const BACKGROUND_COLORS = {
  shadow: '#5288d3',
  lift: '#c1b7e4',
  glow: '#5d71d1',
} as const;

export type BackgroundColors = {
  shadow: string;
  lift: string;
  glow: string;
};

export type BackgroundOptions = {
  colors?: Partial<BackgroundColors>;
  speed?: number;
  intensity?: number;
  focus?: number;
  aperture?: number;
  autoPlay?: boolean;
  stillTime?: number;
};

export type BackgroundController = {
  dispose(): void;
};
