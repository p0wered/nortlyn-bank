import { ArrowIcon } from './ArrowIcon';
import { Button } from './Button';
import styles from './BentoGrid.module.css';

type BentoGridProps = {
  className?: string;
};

export function BentoGrid({ className = '' }: BentoGridProps) {
  return (
    <div className={`${styles.grid} ${className}`}>
      <div className={`${styles.card} ${styles.mainCard}`}>
        <div className={styles.mainCopy}>
          <h1 className={styles.mainHeading}>
            Карта на каждый день
          </h1>
          <p className={styles.mainDescription}>
            Покупки, переводы и кешбэк — в одном приложении.
          </p>
        </div>
        <Button icon={<ArrowIcon />} disabled>
          Оформить карту
        </Button>
      </div>

      <div className={`${styles.card} ${styles.cashbackCard}`}>
        <div>
          <h2 className={styles.heading}>
            Кешбэк на ваши планы
          </h2>
          <p className={styles.description}>
            Выбирайте категории каждый месяц.
          </p>
        </div>
        <Button variant="text" icon={<ArrowIcon />} disabled>
          О кешбэке
        </Button>
      </div>

      <div className={`${styles.card} ${styles.savingsCard}`}>
        <div>
          <h2 className={styles.heading}>
            Копите на своё
          </h2>
          <p className={styles.description}>
            Накопительный счёт для ваших целей.
          </p>
        </div>
        <Button variant="secondary" icon={<ArrowIcon />} disabled>
          О счёте
        </Button>
      </div>

      <div className={`${styles.card} ${styles.shortCard} ${styles.sharedExpensesCard}`}>
        <h2 className={styles.shortHeading}>
          Делите расходы с друзьями
        </h2>
        <ArrowIcon className={styles.shortArrow} />
      </div>

      <div className={`${styles.card} ${styles.shortCard} ${styles.transfersCard}`}>
        <h2 className={styles.shortHeading}>
          Переводы по номеру телефона
        </h2>
        <ArrowIcon className={styles.shortArrow} />
      </div>
    </div>
  );
}
