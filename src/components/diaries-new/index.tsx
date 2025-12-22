"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { Input } from "@/commons/components/input";
import { Button } from "@/commons/components/button";
import { EmotionType, emotionList } from "@/commons/constants/enum";
import { useLinkModalClose } from "./hooks/index.link.modal.close.hook";

export default function DiariesNew() {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(
    null
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { handleClose } = useLinkModalClose();

  return (
    <div className={styles.wrapper}>
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
                name="emotion"
                value={emotion.type}
                checked={selectedEmotion === emotion.type}
                onChange={(e) =>
                  setSelectedEmotion(e.target.value as EmotionType)
                }
                className={styles.radioInput}
              />
              <span className={styles.radioText}>{emotion.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Input Title */}
      <div className={styles.inputTitle}>
        <label className={styles.inputLabel}>제목</label>
        <Input
          variant="primary"
          size="medium"
          theme="light"
          placeholder="제목을 입력합니다."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.inputField}
        />
      </div>

      {/* Input Content */}
      <div className={styles.inputContent}>
        <label className={styles.inputLabel}>내용</label>
        <textarea
          placeholder="내용을 입력합니다."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.textareaField}
        />
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
        >
          닫기
        </Button>
        <Button
          variant="primary"
          size="large"
          theme="light"
          className={styles.submitButton}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
}
