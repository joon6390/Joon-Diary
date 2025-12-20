import React from 'react';
import styles from './styles.module.css';

export default function DiariesNew() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>header</div>
      <div className={styles.gap}></div>
      <div className={styles.emotionBox}>emotion-box</div>
      <div className={styles.gap}></div>
      <div className={styles.inputTitle}>input-title</div>
      <div className={styles.gapSmall}></div>
      <div className={styles.inputContent}>input-content</div>
      <div className={styles.gap}></div>
      <div className={styles.footer}>footer</div>
    </div>
  );
}

