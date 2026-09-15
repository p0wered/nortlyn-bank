import { AmbientBackground } from './AmbientBackground';

export function Hero() {
  return (
    <section className="hero" aria-label="Главный экран">
      <AmbientBackground
        colors={{ shadow: '#073973', lift: '#4878c7', glow: '#8a8cff' }}
        intensity={1.1}
        focus={0.36}
        aperture={1.15}
        speed={1}
        autoPlay
      />
    </section>
  );
}
