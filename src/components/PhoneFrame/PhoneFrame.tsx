import type { ReactNode } from 'react';
import iphoneFrame from '../../refs/iphone-17-mock.png';
import styles from './PhoneFrame.module.css';

type PhoneFrameProps = {
  children?: ReactNode;
};

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div
      className={styles.frame}
      data-testid="phone-frame"
    >
      <div
        className={styles.screen}
        aria-label="Мобильный viewport"
        data-phone-screen
      >
        <div className={styles.content}>
          {children}
        </div>
      </div>

      <img
        className={styles.image}
        src={iphoneFrame}
        alt=""
        draggable={false}
        aria-hidden="true"
      />
    </div>
  );
}
