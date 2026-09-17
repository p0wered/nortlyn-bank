import { PhoneFrame } from '../../components/PhoneFrame/PhoneFrame.tsx';
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
