import { Hero } from '../components/Hero';

export function HomePage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-white">
      <Hero />
      <section
        className="relative z-10 -mt-9 min-h-[58dvh] rounded-t-[2.25rem] bg-white max-md:-mt-6 max-md:min-h-[60dvh] max-md:rounded-t-3xl"
        aria-label="Основной контент"
      />
    </main>
  );
}
