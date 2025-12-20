import React from "react";
import styles from "./styles.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>Header (1168 × 60)</header>
      <div className={styles.gap} />
      <div className={styles.banner}>Banner (1168 × 240)</div>
      <div className={styles.gap} />
      <nav className={styles.navigation}>Navigation (1168 × 48)</nav>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>Footer (1168 × 160)</footer>
    </div>
  );
}

