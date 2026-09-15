import { useEffect, useRef, type CSSProperties } from 'react';
import { createBackground } from '../lib/background';
import { BACKGROUND_COLORS, type BackgroundOptions } from '../lib/types';

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
      className={`absolute inset-0 bg-[radial-gradient(ellipse_at_88%_16%,var(--ambient-glow),transparent_58%),linear-gradient(145deg,var(--ambient-shadow),var(--ambient-lift))] ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block size-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_103%_92%,rgba(188,183,255,0.42),transparent_47%),radial-gradient(ellipse_at_90%_4%,rgba(100,153,255,0.2),transparent_42%)] mix-blend-screen" />
    </div>
  );
}
