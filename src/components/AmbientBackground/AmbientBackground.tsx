import { useEffect, useRef, type CSSProperties } from 'react';
import { createBackground } from '../../lib/background.ts';
import { BACKGROUND_COLORS, type BackgroundOptions } from '../../lib/types.ts';
import styles from './AmbientBackground.module.css';

export type AmbientBackgroundProps = BackgroundOptions & { className?: string };

export function AmbientBackground({
  className = '',
  colors,
  speed = 1,
  intensity = 1,
  focus = 0.32,
  aperture = 1,
  autoPlay = true,
  stillTime,
}: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shadow = colors?.shadow ?? BACKGROUND_COLORS.shadow;
  const lift = colors?.lift ?? BACKGROUND_COLORS.lift;
  const glow = colors?.glow ?? BACKGROUND_COLORS.glow;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createBackground(canvas, {
      colors: { shadow, lift, glow }, speed, intensity, focus, aperture, autoPlay, stillTime,
    });

    return () => controller.dispose();
  }, [aperture, autoPlay, focus, glow, intensity, lift, shadow, speed, stillTime]);

  const style = {
    '--ambient-shadow': shadow,
    '--ambient-lift': lift,
    '--ambient-glow': glow,
  } as CSSProperties;

  return (
    <div
      className={`${styles.background} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.overlay} />
    </div>
  );
}
