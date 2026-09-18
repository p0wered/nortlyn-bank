import { useLayoutEffect, useRef } from 'react';
import { spring } from 'motion';
import { animate } from 'motion/mini';

const entranceEase = [0.23, 1, 0.32, 1] as const;

export function useHeroEntrance() {
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 48rem)');
    const cards = Array.from(grid.children) as HTMLElement[];
    const controls: ReturnType<typeof animate>[] = [];
    const elements = new Set<HTMLElement>(cards);
    let observer: IntersectionObserver | undefined;
    let stopped = false;

    function play(
      element: HTMLElement,
      from: string,
      delay: number,
      duration: number,
    ) {
      elements.add(element);
      controls.push(
        animate(
          element,
          { transform: [from, 'none'] },
          { type: spring, duration, bounce: 0, delay },
        ),
        animate(
          element,
          { opacity: [0, 1] },
          { duration: 0.24, ease: entranceEase, delay },
        ),
      );
    }

    function finish() {
      stopped = true;
      observer?.disconnect();
      controls.forEach((control) => control.cancel());
      elements.forEach((element) => {
        element.style.removeProperty('opacity');
        element.style.removeProperty('transform');
      });
    }

    // Keep each card's copy together so its typography never separates in flight.
    const entrances = cards.map((card, index) => {
      const content = card.firstElementChild as HTMLElement | null;
      const action = card.querySelector<HTMLElement>('button');

      card.style.opacity = '0';
      if (!reducedMotion.matches) {
        [content, action].forEach((element) => {
          if (!element) return;
          elements.add(element);
          element.style.opacity = '0';
        });
      }

      return { card, content, action, index };
    });

    function reveal(entrance: (typeof entrances)[number], delay: number) {
      if (stopped) return;
      const { card, content, action } = entrance;

      if (reducedMotion.matches) {
        controls.push(animate(card, { opacity: [0, 1] }, { duration: 0.15 }));
        return;
      }

      const from = desktop.matches
        ? 'translate3d(0, 28px, 0) scale(0.97)'
        : 'translate3d(0, 18px, 0)';

      play(card, from, delay, 0.7);
      if (content) play(content, 'translate3d(0, 6px, 0)', delay + 0.08, 0.5);
      if (action) play(action, 'translate3d(0, 6px, 0)', delay + 0.14, 0.5);
    }

    if (desktop.matches || reducedMotion.matches) {
      entrances.forEach((entrance) => reveal(entrance, entrance.index * 0.06));
    } else {
      // Cards below the mobile fold enter when seen, rather than animating offscreen.
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const entrance = entrances.find(({ card }) => card === entry.target);
          if (entrance) reveal(entrance, 0);
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.15 });

      cards.forEach((card) => observer?.observe(card));
    }

    grid.addEventListener('focusin', finish);
    reducedMotion.addEventListener('change', finish);
    window.addEventListener('resize', finish, { once: true });

    return () => {
      finish();
      grid.removeEventListener('focusin', finish);
      reducedMotion.removeEventListener('change', finish);
      window.removeEventListener('resize', finish);
    };
  }, []);

  return gridRef;
}
