import { AmbientBackground } from './AmbientBackground';
import { BentoGrid } from './BentoGrid';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section
      className={styles.hero}
      aria-label="Главный экран"
    >
      <AmbientBackground
        colors={{
          shadow: '#224f91',
          lift: '#456bc5',
          glow: '#7c9bdf',
        }}
        intensity={1.1}
        focus={0.36}
        aperture={1.15}
        speed={1}
        autoPlay
      />
      <BentoGrid className={styles.grid} />
    </section>
  );
}
