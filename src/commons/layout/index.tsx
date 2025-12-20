import React from "react";
import styles from "./styles.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>민지의 다이어리</div>
          <div className={styles.darkMode}>다크모드</div>
        </div>
      </header>
      <div className={styles.gap} />
      <div className={styles.banner}>
        <div className={styles.bannerImage} />
      </div>
      <div className={styles.gap} />
      <nav className={styles.navigation}>
        <div className={styles.navContent}>
          <div className={`${styles.tab} ${styles.tabActive}`}>일기보관함</div>
          <div className={styles.tab}>사진보관함</div>
        </div>
      </nav>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerTitle}>민지의 다이어리</div>
          <div className={styles.footerInfo}>대표 : {"{name}"}</div>
          <div className={styles.footerCopyright}>
            Copyright © 2024. {"{name}"} Co., Ltd.
          </div>
        </div>
      </footer>
    </div>
  );
}

