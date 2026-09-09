import { useEffect, useRef, type RefObject } from 'react';
import { IMPULSE_DURATION, REFERENCE_TIME, type BackgroundController, type BackgroundStatus } from '../lib/types';

const STATUS_COPY: Record<BackgroundStatus, string> = {
  running: 'Импульс проходит по полотну',
  settled: 'След затих · можно повторить импульс',
  paused: 'Анимация на паузе',
  reduced: 'Движение отключено по настройкам системы',
  lost: 'Восстановление WebGL…',
  fallback: 'WebGL недоступен · статичный фон',
};

type SliderId = 'speed' | 'intensity' | 'focus' | 'aperture';

const SLIDERS: Array<{
  id: SliderId;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  format: (value: number) => string;
  apply: keyof Pick<BackgroundController, 'setSpeed' | 'setIntensity' | 'setFocus' | 'setAperture'>;
}> = [
  {
    id: 'speed',
    label: 'Скорость',
    min: 0.1,
    max: 2,
    step: 0.1,
    defaultValue: 1,
    format: (value) => `${value.toFixed(1)}×`,
    apply: 'setSpeed',
  },
  {
    id: 'intensity',
    label: 'Свечение',
    min: 0.3,
    max: 1.5,
    step: 0.05,
    defaultValue: 1,
    format: (value) => `${Math.round(value * 100)}%`,
    apply: 'setIntensity',
  },
  {
    id: 'focus',
    label: 'Ширина резкой зоны',
    min: 0.15,
    max: 0.85,
    step: 0.01,
    defaultValue: 0.32,
    format: (value) => `${Math.round(value * 100)}%`,
    apply: 'setFocus',
  },
  {
    id: 'aperture',
    label: 'Размытие по глубине',
    min: 0,
    max: 2,
    step: 0.1,
    defaultValue: 1,
    format: (value) => `${value.toFixed(1)}×`,
    apply: 'setAperture',
  },
];

type ControlsProps = {
  status: BackgroundStatus;
  controllerRef: RefObject<BackgroundController | null>;
  timelineRef: RefObject<HTMLInputElement | null>;
  timelineValueRef: RefObject<HTMLOutputElement | null>;
  clean: boolean;
  onClean: () => void;
  onRestore: () => void;
};

export function Controls({
  status,
  controllerRef,
  timelineRef,
  timelineValueRef,
  clean,
  onClean,
  onRestore,
}: ControlsProps) {
  const restoreRef = useRef<HTMLButtonElement>(null);
  const cleanRef = useRef<HTMLButtonElement>(null);
  const wasClean = useRef(clean);
  const outputs = useRef<Partial<Record<SliderId, HTMLOutputElement | null>>>({});

  useEffect(() => {
    const previouslyClean = wasClean.current;
    wasClean.current = clean;
    if (clean && !previouslyClean) restoreRef.current?.focus();
    if (!clean && previouslyClean) cleanRef.current?.focus();
  }, [clean]);

  useEffect(() => {
    if (!clean) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onRestore();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [clean, onRestore]);

  function applySlider(id: SliderId, value: number): void {
    const slider = SLIDERS.find((item) => item.id === id);
    if (!slider) return;
    controllerRef.current?.[slider.apply](value);
    const output = outputs.current[id];
    if (output) output.textContent = slider.format(value);
  }

  const pauseLabel = status === 'paused' || status === 'reduced' ? 'Продолжить' : 'Пауза';
  const pauseDisabled = status === 'lost' || status === 'fallback' || status === 'settled';

  return (
    <>
      <details className="controls" open>
        <summary>
          Настройки фона <span>01 / Ambient</span>
        </summary>
        <div className="settings">
          {SLIDERS.map((slider) => (
            <div key={slider.id}>
              <label htmlFor={slider.id}>
                {slider.label}{' '}
                <output
                  ref={(node) => {
                    outputs.current[slider.id] = node;
                  }}
                >
                  {slider.format(slider.defaultValue)}
                </output>
              </label>
              <input
                id={slider.id}
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                defaultValue={slider.defaultValue}
                onInput={(event) => applySlider(slider.id, Number(event.currentTarget.value))}
              />
            </div>
          ))}
          <label htmlFor="timeline">
            Момент импульса <output ref={timelineValueRef}>0.00 с</output>
          </label>
          <input
            ref={timelineRef}
            id="timeline"
            type="range"
            min={0}
            max={IMPULSE_DURATION}
            step={0.01}
            defaultValue={0}
            onInput={(event) => controllerRef.current?.seek(Number(event.currentTarget.value))}
          />
          <button id="reference" type="button" onClick={() => controllerRef.current?.seek(REFERENCE_TIME)}>
            Контрольный кадр · 0,35 с
          </button>
          <button id="replay" type="button" onClick={() => controllerRef.current?.replay()}>
            Повторить импульс
          </button>
          <div className="buttons">
            <button
              id="pause"
              type="button"
              disabled={pauseDisabled}
              onClick={() => controllerRef.current?.toggle()}
            >
              {pauseLabel}
            </button>
            <button ref={cleanRef} id="clean" type="button" onClick={onClean}>
              Только фон
            </button>
          </div>
          <p id="status" role="status">
            {STATUS_COPY[status]}
          </p>
        </div>
      </details>
      <button ref={restoreRef} id="restore" type="button" hidden={!clean} onClick={onRestore}>
        Показать управление
      </button>
    </>
  );
}
