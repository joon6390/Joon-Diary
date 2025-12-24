"use client";

import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { useRouter } from "next/navigation";
import { paths } from "@/commons/constants/url";
import styles from "./styles.module.css";

export default function AuthLogin() {
  const router = useRouter();

  const handleSignupLinkClick = () => {
    router.push(paths.auth.signup);
  };

  return (
    <div className={styles.container} data-testid="login-container">
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>계정에 로그인하세요</p>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              이메일
            </label>
            <Input
              id="email"
              type="email"
              variant="primary"
              size="large"
              theme="light"
              placeholder="이메일을 입력하세요"
              data-testid="login-email-input"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              variant="primary"
              size="large"
              theme="light"
              placeholder="비밀번호를 입력하세요"
              data-testid="login-password-input"
              className={styles.input}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            theme="light"
            data-testid="login-submit-button"
            className={styles.submitButton}
          >
            로그인
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            계정이 없으신가요?{" "}
            <button
              type="button"
              onClick={handleSignupLinkClick}
              className={styles.link}
              data-testid="signup-link"
            >
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

