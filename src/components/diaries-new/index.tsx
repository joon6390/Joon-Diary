"use client";

import React from "react";
import styles from "./styles.module.css";
import { Button } from "@/commons/components/button";
import { emotionList } from "@/commons/constants/enum";
import { useLinkModalClose } from "./hooks/index.link.modal.close.hook";
import { useFormHook } from "./hooks/index.form.hook";

export default function DiariesNew() {
  const { handleClose } = useLinkModalClose();
  const { register, handleSubmit, errors, isSubmitDisabled } = useFormHook();

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>일기 쓰기</h1>
        </div>

        {/* Emotion Box */}
        <div className={styles.emotionBox}>
          <p className={styles.emotionQuestion}>오늘 기분은 어땠나요?</p>
          <div className={styles.emotionRadioGroup}>
            {emotionList.map((emotion) => (
              <label key={emotion.type} className={styles.radioLabel}>
                <input
                  type="radio"
                  value={emotion.type}
                  {...register("emotion")}
                  className={styles.radioInput}
                />
                <span className={styles.radioText}>{emotion.label}</span>
              </label>
            ))}
          </div>
          {errors.emotion && (
            <p className={styles.errorText}>{errors.emotion.message}</p>
          )}
        </div>

        {/* Input Title */}
        <div className={styles.inputTitle}>
          <label className={styles.inputLabel}>제목</label>
          <input
            placeholder="제목을 입력합니다."
            {...register("title")}
            className={styles.inputField}
          />
          {errors.title && (
            <p className={styles.errorText}>{errors.title.message}</p>
          )}
        </div>

        {/* Input Content */}
        <div className={styles.inputContent}>
          <label className={styles.inputLabel}>내용</label>
          <textarea
            placeholder="내용을 입력합니다."
            {...register("content")}
            className={styles.textareaField}
          />
          {errors.content && (
            <p className={styles.errorText}>{errors.content.message}</p>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            variant="secondary"
            size="large"
            theme="light"
            className={styles.closeButton}
            onClick={handleClose}
            data-testid="diary-close-button"
            type="button"
          >
            닫기
          </Button>
          <Button
            variant="primary"
            size="large"
            theme="light"
            className={styles.submitButton}
            disabled={isSubmitDisabled}
            data-testid="diary-submit-button"
            type="submit"
          >
            등록하기
          </Button>
        </div>
      </form>
    </div>
  );
}
