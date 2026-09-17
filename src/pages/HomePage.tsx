import { Hero } from '../components/Hero';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <main className={styles.page}>
      <Hero />
      <section className={styles.content} aria-label="Основной контент" />
    </main>
  );
}
