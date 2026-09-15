import { AmbientBackground } from './AmbientBackground';

const tileClass =
  'min-h-0 min-w-0 overflow-hidden rounded-[clamp(1.35rem,1.55vw,2rem)] border border-white/20 bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1.25rem_3.5rem_rgba(11,47,108,0.08)] backdrop-blur-[100px] max-md:rounded-[1.125rem]';

export function Hero() {
  return (
    <section
      className="relative min-h-[94dvh] overflow-hidden bg-[#2c6195] max-md:min-h-[93dvh]"
      aria-label="Главный экран"
    >
      <AmbientBackground
        colors={{
          shadow: '#2c6195',
          lift: '#7185d8',
          glow: '#a1a4f5',
        }}
        intensity={1.1}
        focus={0.36}
        aperture={1.15}
        speed={1}
        autoPlay
      />
      <div
        className="absolute top-[clamp(8.5rem,17.5dvh,15rem)] left-1/2 z-10 grid h-[clamp(22rem,56dvh,48rem)] w-[min(80vw,100rem)] -translate-x-1/2 grid-cols-3 grid-rows-[2.15fr_1.05fr_0.9fr] gap-[clamp(1rem,1.65vw,2rem)] max-md:top-[15dvh] max-md:h-[min(58dvh,32rem)] max-md:w-[calc(100%_-_2rem)] max-md:gap-3"
        aria-hidden="true"
      >
        <div className={`${tileClass} [grid-column:1/3] [grid-row:1/3]`} />
        <div className={`${tileClass} [grid-column:3] [grid-row:1]`} />
        <div className={`${tileClass} [grid-column:3] [grid-row:2/4]`} />
        <div className={`${tileClass} [grid-column:1] [grid-row:3]`} />
        <div className={`${tileClass} [grid-column:2] [grid-row:3]`} />
      </div>
    </section>
  );
}
