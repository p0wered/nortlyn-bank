export const IMPULSE_DURATION = 7.6;
export const REFERENCE_TIME = 0.35;

export const BACKGROUND_COLORS = {
  shadow: '#023d26',
  lift: '#1a596e',
  glow: '#66f21a',
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
