"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/commons/components/button";
import { Input } from "@/commons/components/input";
import { getEmotionData } from "@/commons/constants/enum";
import { useBindingHook } from "./hooks/index.binding.hook";
import styles from "./styles.module.css";

// Mock 회고 데이터
const mockRetrospects = [
  {
    id: 1,
    text: "3년이 지나고 다시 보니 이때가 그립다.",
    date: "2024. 09. 24",
  },
  {
    id: 2,
    text: "3년이 지나고 다시 보니 이때가 그립다.",
    date: "2024. 09. 24",
  },
];

export default function DiariesDetail() {
  const { diary, isLoading, formattedDate } = useBindingHook();
  const [retrospectInput, setRetrospectInput] = useState("");

  // 일기 데이터가 없거나 로딩 중일 때 처리
  if (isLoading) {
    return (
      <div className={styles.container} data-testid="diaries-detail-container">
        <div className={styles.gap64}></div>
        <div>로딩 중...</div>
      </div>
    );
  }

  if (!diary) {
    return (
      <div className={styles.container} data-testid="diaries-detail-container">
        <div className={styles.gap64}></div>
        <div>일기를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const emotionData = getEmotionData(diary.emotion);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(diary.content);
  };

  const handleEdit = () => {
    console.log("수정 버튼 클릭");
  };

  const handleDelete = () => {
    console.log("삭제 버튼 클릭");
  };

  const handleRetrospectSubmit = () => {
    console.log("회고 입력:", retrospectInput);
    setRetrospectInput("");
  };

  return (
    <div className={styles.container} data-testid="diaries-detail-container">
      <div className={styles.gap64}></div>

      {/* detail-title */}
      <div className={styles.detailTitle}>
        <div className={styles.titleSection}>
          <h1 className={styles.title} data-testid="diary-title">
            {diary.title}
          </h1>
        </div>
        <div className={styles.emotionDateSection}>
          <div className={styles.emotionWrapper}>
            <Image
              src={`/images/${emotionData.images.small}`}
              alt={emotionData.label}
              width={32}
              height={32}
              className={styles.emotionIcon}
              data-testid="diary-emotion-icon"
            />
            <span
              className={styles.emotionText}
              style={{ color: emotionData.color }}
              data-testid="diary-emotion-text"
            >
              {emotionData.label}
            </span>
          </div>
          <div className={styles.dateWrapper}>
            <span className={styles.dateText} data-testid="diary-date">
              {formattedDate}
            </span>
            <span className={styles.dateText}>작성</span>
          </div>
        </div>
      </div>

      <div className={styles.gap24}></div>

      {/* detail-content */}
      <div className={styles.detailContent}>
        <div className={styles.contentSection}>
          <h2 className={styles.contentLabel}>내용</h2>
          <p className={styles.contentText} data-testid="diary-content">
            {diary.content}
          </p>
        </div>
      </div>

      <div className={styles.copySection}>
        <button className={styles.copyButton} onClick={handleCopyContent}>
          <Image
            src="/icons/copy_outline_light_m.svg"
            alt="복사"
            width={24}
            height={24}
          />
          <span className={styles.copyText}>내용 복사</span>
        </button>
      </div>

      <div className={styles.gap24}></div>

      {/* detail-footer */}
      <div className={styles.detailFooter}>
        <Button
          variant="secondary"
          theme="light"
          size="medium"
          onClick={handleEdit}
          className={styles.footerButton}
        >
          수정
        </Button>
        <Button
          variant="secondary"
          theme="light"
          size="medium"
          onClick={handleDelete}
          className={styles.footerButton}
        >
          삭제
        </Button>
      </div>

      <div className={styles.gap24}></div>

      {/* retrospect-input */}
      <div className={styles.retrospectInput}>
        <h2 className={styles.retrospectLabel}>회고</h2>
        <div className={styles.retrospectInputWrapper}>
          <Input
            variant="primary"
            theme="light"
            size="medium"
            placeholder="회고를 남겨보세요."
            value={retrospectInput}
            onChange={(e) => setRetrospectInput(e.target.value)}
            className={styles.retrospectInputField}
          />
          <Button
            variant="primary"
            theme="light"
            size="large"
            onClick={handleRetrospectSubmit}
            className={styles.retrospectButton}
          >
            입력
          </Button>
        </div>
      </div>

      <div className={styles.gap16}></div>

      {/* retrospect-list */}
      <div className={styles.retrospectList}>
        {mockRetrospects.map((retrospect, index) => (
          <div key={retrospect.id}>
            {index > 0 && <div className={styles.retrospectDivider}></div>}
            <div className={styles.retrospectItem}>
              <span className={styles.retrospectText}>{retrospect.text}</span>
              <span className={styles.retrospectDate}>[{retrospect.date}]</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.gap40}></div>
    </div>
  );
}
