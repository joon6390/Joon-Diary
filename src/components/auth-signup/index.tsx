"use client";

import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { useRouter } from "next/navigation";
import { paths } from "@/commons/constants/url";
import styles from "./styles.module.css";
import { useFormHook } from "./hooks/index.form.hook";
import { Controller } from "react-hook-form";
import Image from "next/image";

export default function AuthSignup() {
  const router = useRouter();
  const { control, handleSubmit, errors, isSubmitDisabled } = useFormHook();

  const handleLoginLinkClick = () => {
    router.push(paths.auth.login);
  };

  const handleBackToDiaries = () => {
    router.push(paths.diaries.list);
  };

  return (
    <div className={styles.container} data-testid="signup-container">
      <button
        type="button"
        onClick={handleBackToDiaries}
        className={styles.backButton}
        data-testid="back-to-diaries-button"
        aria-label="다이어리로 돌아가기"
      >
        <Image
          src="/icons/back_outline_light_m.svg"
          alt="뒤로가기"
          width={24}
          height={24}
          className={styles.backIcon}
        />
        <span className={styles.backText}>다이어리로 돌아가기</span>
      </button>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>새로운 계정을 만들어보세요</p>
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
                  data-testid="signup-email-input"
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
                  data-testid="signup-password-input"
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

          <div className={styles.inputGroup}>
            <label htmlFor="passwordConfirm" className={styles.label}>
              비밀번호 확인
            </label>
            <Controller
              name="passwordConfirm"
              control={control}
              render={({ field }) => (
                <Input
                  id="passwordConfirm"
                  type="password"
                  variant="primary"
                  size="large"
                  theme="light"
                  placeholder="비밀번호를 다시 입력하세요"
                  data-testid="signup-password-confirm-input"
                  {...field}
                />
              )}
            />
            {errors.passwordConfirm && (
              <p className={styles.error} data-testid="password-confirm-error">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              이름
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  id="name"
                  type="text"
                  variant="primary"
                  size="large"
                  theme="light"
                  placeholder="이름을 입력하세요"
                  data-testid="signup-name-input"
                  {...field}
                />
              )}
            />
            {errors.name && (
              <p className={styles.error} data-testid="name-error">
                {errors.name.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            theme="light"
            disabled={isSubmitDisabled}
            data-testid="signup-submit-button"
            className={styles.submitButton}
          >
            회원가입
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              onClick={handleLoginLinkClick}
              className={styles.link}
              data-testid="login-link"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
