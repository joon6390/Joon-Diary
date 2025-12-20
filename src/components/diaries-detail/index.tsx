"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/commons/components/button";
import { Input } from "@/commons/components/input";
import { EmotionType, getEmotionData } from "@/commons/constants/enum";
import styles from "./styles.module.css";

// Mock 데이터
const mockDiaryDetail = {
  title: "이것은 타이틀 입니다.",
  emotion: EmotionType.Happy,
  date: "2024. 07. 12",
  content: "내용이 들어갑니다".repeat(45),
};

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
  const emotionData = getEmotionData(mockDiaryDetail.emotion);
  const [retrospectInput, setRetrospectInput] = useState("");

  const handleCopyContent = () => {
    navigator.clipboard.writeText(mockDiaryDetail.content);
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
    </div>
  );
}
