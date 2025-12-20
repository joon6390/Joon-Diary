import React from "react";
import styles from "./styles.module.css";

export default function Diaries() {
  return (
    <div className={styles.container}>
      <div className={styles.gap1} />
      <div className={styles.search} />
      <div className={styles.gap2} />
      <div className={styles.main} />
      <div className={styles.gap3} />
      <div className={styles.pagination} />
      <div className={styles.gap4} />
    </div>
  );
}

