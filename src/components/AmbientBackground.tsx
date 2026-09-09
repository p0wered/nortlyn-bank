import { useEffect, useRef, type RefObject } from 'react';
import { createBackground } from '../lib/background';
import type { BackgroundController, BackgroundStatus } from '../lib/types';

type AmbientBackgroundProps = {
  controllerRef: RefObject<BackgroundController | null>;
  onStatus: (status: BackgroundStatus) => void;
  onTime: (time: number) => void;
};

export function AmbientBackground({ controllerRef, onStatus, onTime }: AmbientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onStatusRef = useRef(onStatus);
  const onTimeRef = useRef(onTime);
  onStatusRef.current = onStatus;
  onTimeRef.current = onTime;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const controller = createBackground(
      canvas,
      (status) => onStatusRef.current(status),
      (time) => onTimeRef.current(time),
    );
    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
  }, [controllerRef]);

  return <canvas ref={canvasRef} id="background" aria-hidden="true" />;
}
