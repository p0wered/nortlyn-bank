import { useCallback, useEffect, useRef, useState } from 'react';
import { AmbientBackground } from './components/AmbientBackground';
import { Controls } from './components/Controls';
import type { BackgroundController, BackgroundStatus } from './lib/types';

export function App() {
  const controllerRef = useRef<BackgroundController | null>(null);
  const timelineRef = useRef<HTMLInputElement>(null);
  const timelineValueRef = useRef<HTMLOutputElement>(null);
  const [status, setStatus] = useState<BackgroundStatus>('running');
  const [clean, setClean] = useState(false);

  const onTime = useCallback((time: number) => {
    if (timelineRef.current) timelineRef.current.value = String(time);
    if (timelineValueRef.current) timelineValueRef.current.textContent = `${time.toFixed(2)} с`;
  }, []);

  useEffect(() => {
    document.body.classList.toggle('clean', clean);
    return () => document.body.classList.remove('clean');
  }, [clean]);

  return (
    <>
      <AmbientBackground controllerRef={controllerRef} onStatus={setStatus} onTime={onTime} />
      <Controls
        status={status}
        controllerRef={controllerRef}
        timelineRef={timelineRef}
        timelineValueRef={timelineValueRef}
        clean={clean}
        onClean={() => setClean(true)}
        onRestore={() => setClean(false)}
      />
    </>
  );
}
