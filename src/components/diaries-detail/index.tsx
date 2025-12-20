"use client";

import Image from "next/image";
import { Button } from "@/commons/components/button";
import { EmotionType, getEmotionData } from "@/commons/constants/enum";
import styles from "./styles.module.css";

// Mock 데이터
const mockDiaryDetail = {
  title: "이것은 타이틀 입니다.",
  emotion: EmotionType.Happy,
  date: "2024. 07. 12",
  content: "내용이 들어갑니다".repeat(45),
};

export default function DiariesDetail() {
  const emotionData = getEmotionData(mockDiaryDetail.emotion);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(mockDiaryDetail.content);
  };

  const handleEdit = () => {
    console.log("수정 버튼 클릭");
  };

  const handleDelete = () => {
    console.log("삭제 버튼 클릭");
  };

  return (
    <div className={styles.container}>
      <div className={styles.gap64}></div>

      {/* detail-title */}
      <div className={styles.detailTitle}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{mockDiaryDetail.title}</h1>
        </div>
        <div className={styles.emotionDateSection}>
          <div className={styles.emotionWrapper}>
            <Image
              src={`/images/${emotionData.images.small}`}
              alt={emotionData.label}
              width={32}
              height={32}
              className={styles.emotionIcon}
            />
            <span
              className={styles.emotionText}
              style={{ color: emotionData.color }}
            >
              {emotionData.label}
            </span>
          </div>
          <div className={styles.dateWrapper}>
            <span className={styles.dateText}>{mockDiaryDetail.date}</span>
            <span className={styles.dateText}>작성</span>
          </div>
        </div>
      </div>

      <div className={styles.gap24}></div>

      {/* detail-content */}
      <div className={styles.detailContent}>
        <div className={styles.contentSection}>
          <h2 className={styles.contentLabel}>내용</h2>
          <p className={styles.contentText}>{mockDiaryDetail.content}</p>
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
      </div>

      <div className={styles.gap24}></div>

      {/* detail-footer */}
      <div className={styles.detailFooter}>
        <Button
          variant="secondary"
          theme="light"
          size="large"
          onClick={handleEdit}
          className={styles.footerButton}
        >
          수정
        </Button>
        <Button
          variant="secondary"
          theme="light"
          size="large"
          onClick={handleDelete}
          className={styles.footerButton}
        >
          삭제
        </Button>
      </div>

      <div className={styles.gap24}></div>
      <div className={styles.retrospectInput}>retrospect-input</div>
      <div className={styles.gap16}></div>
      <div className={styles.retrospectList}>retrospect-list</div>
    </div>
  );
}
