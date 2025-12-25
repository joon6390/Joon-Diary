"use client";

import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { useRouter } from "next/navigation";
import { paths } from "@/commons/constants/url";
import styles from "./styles.module.css";
import { useFormHook } from "./hooks/index.form.hook";
import { Controller } from "react-hook-form";

export default function AuthLogin() {
  const router = useRouter();
  const { control, handleSubmit, errors, isSubmitDisabled } = useFormHook();

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

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              이메일
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="email"
                  type="email"
                  variant="primary"
                  size="large"
                  theme="light"
                  placeholder="이메일을 입력하세요"
                  data-testid="login-email-input"
                  {...field}
                />
              )}
            />
            {errors.email && (
              <p className={styles.error} data-testid="email-error">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  id="password"
                  type="password"
                  variant="primary"
                  size="large"
                  theme="light"
                  placeholder="비밀번호를 입력하세요"
                  data-testid="login-password-input"
                  {...field}
                />
              )}
            />
            {errors.password && (
              <p className={styles.error} data-testid="password-error">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            theme="light"
            disabled={isSubmitDisabled}
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
