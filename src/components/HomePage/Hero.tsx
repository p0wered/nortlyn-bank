import { AmbientBackground } from '../AmbientBackground/AmbientBackground.tsx';
import { Button } from '../Button/Button.tsx';
import styles from './Hero.module.css';
import { useHeroEntrance } from './useHeroEntrance.ts';

export function Hero() {
  const gridRef = useHeroEntrance();

  return (
    <section
      className={styles.hero}
      aria-label="Главный экран"
    >
      <AmbientBackground
        colors={{
          shadow: '#4379bf',
          lift: '#ada1da',
          glow: '#6372d1',
        }}
        intensity={1.1}
        focus={0.36}
        aperture={1.15}
        speed={1}
        autoPlay
      />
      <div ref={gridRef} className={styles.grid}>
        <div className={`${styles.card} ${styles.mainCard}`}>
          <div className={styles.mainCopy}>
            <div className={styles.headingViewport}>
              <h1 className={styles.mainHeading}>
                Карта на каждый день
              </h1>
            </div>
            <p className={styles.mainDescription}>
              Покупки, переводы и кешбэк — в одном приложении.
            </p>
          </div>
          <Button className={styles.mainAction}>
            Оформить карту
          </Button>
        </div>

        <div className={`${styles.card} ${styles.cashbackCard}`}>
          <div className={styles.supportingCopy}>
            <div className={styles.headingViewport}>
              <h2 className={styles.heading}>
                Кешбэк на ваши планы
              </h2>
            </div>
            <p className={styles.description}>
              Выбирайте категории каждый месяц.
            </p>
          </div>
        </div>

        <div className={`${styles.card} ${styles.savingsCard}`}>
          <div className={styles.supportingCopy}>
            <div className={styles.headingViewport}>
              <h2 className={styles.heading}>
                Копите на своё
              </h2>
            </div>
            <p className={styles.description}>
              Накопительный счёт для ваших целей.
            </p>
          </div>
        </div>

        <div className={`${styles.card} ${styles.shortCard} ${styles.sharedExpensesCard}`}>
          <div className={styles.headingViewport}>
            <h2 className={styles.shortHeading}>
              Делите расходы с друзьями
            </h2>
          </div>
        </div>

        <div className={`${styles.card} ${styles.shortCard} ${styles.transfersCard}`}>
          <div className={styles.headingViewport}>
            <h2 className={styles.shortHeading}>
              Переводы по номеру телефона
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
