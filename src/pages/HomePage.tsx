import { Hero } from '../components/Hero';

export function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <section className="content-section" aria-label="Основной контент" />
    </main>
  );
}
