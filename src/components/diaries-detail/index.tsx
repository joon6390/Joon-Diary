import styles from './styles.module.css';

export default function DiariesDetail() {
  return (
    <div className={styles.container}>
      <div className={styles.gap64}></div>
      <div className={styles.detailTitle}>detail-title</div>
      <div className={styles.gap24}></div>
      <div className={styles.detailContent}>detail-content</div>
      <div className={styles.gap24}></div>
      <div className={styles.detailFooter}>detail-footer</div>
      <div className={styles.gap24}></div>
      <div className={styles.retrospectInput}>retrospect-input</div>
      <div className={styles.gap16}></div>
      <div className={styles.retrospectList}>retrospect-list</div>
    </div>
  );
}

