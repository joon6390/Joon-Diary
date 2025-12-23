"use client";

import React from "react";
import Link from "next/link";
import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { paths } from "@/commons/constants/url";
import styles from "./styles.module.css";

export default function AuthSignup() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>회원가입</h1>

        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              variant="primary"
              theme="light"
              size="medium"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              variant="primary"
              theme="light"
              size="medium"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="passwordConfirm" className={styles.label}>
              비밀번호 재입력
            </label>
            <Input
              id="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              variant="primary"
              theme="light"
              size="medium"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>
              이름
            </label>
            <Input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              variant="primary"
              theme="light"
              size="medium"
              className={styles.input}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            theme="light"
            size="large"
            className={styles.submitButton}
          >
            회원가입
          </Button>
        </form>

        <div className={styles.footer}>
          <span className={styles.footerText}>이미 계정이 있으신가요?</span>
          <Link href={paths.auth.login} className={styles.loginLink}>
            로그인 페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
