import { PhoneFrame } from '../components/PhoneFrame';
import styles from './AppPage.module.css';

export function AppPage() {
  return (
    <main className={styles.page}>
      <PhoneFrame>
        <div className={styles.screen} />
      </PhoneFrame>
    </main>
  );
}
