"use client";

import React from "react";
import { useLayoutLinkRouting } from "./hooks/index.link.routing.hook";
import styles from "./styles.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const {
    navigateToDiaries,
    navigateToPictures,
    isDiariesActive,
    isPicturesActive,
  } = useLayoutLinkRouting();

  return (
    <div className={styles.container} data-testid="layout-container">
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div
            className={styles.logo}
            onClick={navigateToDiaries}
            data-testid="layout-logo"
          >
            민지의 다이어리
          </div>
        </div>
      </header>
      <div className={styles.gap} />
      <div className={styles.banner}>
        <div className={styles.bannerImage} />
      </div>
      <div className={styles.gap} />
      <nav className={styles.navigation}>
        <div className={styles.navContent}>
          <div
            className={`${styles.tab} ${isDiariesActive ? styles.tabActive : ""}`}
            onClick={navigateToDiaries}
            data-testid="nav-diaries"
            data-active={isDiariesActive}
          >
            일기보관함
          </div>
          <div
            className={`${styles.tab} ${isPicturesActive ? styles.tabActive : ""}`}
            onClick={navigateToPictures}
            data-testid="nav-pictures"
            data-active={isPicturesActive}
          >
            사진보관함
          </div>
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
