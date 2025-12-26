"use client";

import Image from "next/image";
import { Controller } from "react-hook-form";
import { Button } from "@/commons/components/button";
import { Input } from "@/commons/components/input";
import { getEmotionData } from "@/commons/constants/enum";
import { useBindingHook } from "./hooks/index.binding.hook";
import { useRetrospectFormHook } from "./hooks/index.retrospect.form.hook";
import { useRetrospectBindingHook } from "./hooks/index.retrospect.binding.hook";
import styles from "./styles.module.css";

export default function DiariesDetail() {
  const { diary, isLoading, formattedDate } = useBindingHook();
  const { control, handleSubmit, isSubmitDisabled } =
    useRetrospectFormHook();
  const { retrospects } = useRetrospectBindingHook();

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
        <form onSubmit={handleSubmit} className={styles.retrospectInputWrapper}>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                variant="primary"
                theme="light"
                size="medium"
                placeholder="회고를 남겨보세요."
                className={styles.retrospectInputField}
                data-testid="retrospect-input"
              />
            )}
          />
          <Button
            type="submit"
            variant="primary"
            theme="light"
            size="large"
            disabled={isSubmitDisabled}
            className={styles.retrospectButton}
            data-testid="retrospect-submit-button"
          >
            입력
          </Button>
        </form>
      </div>

      <div className={styles.gap16}></div>

      {/* retrospect-list */}
      <div className={styles.retrospectList} data-testid="retrospect-list">
        {retrospects.map((retrospect, index) => (
          <div key={retrospect.id}>
            {index > 0 && <div className={styles.retrospectDivider}></div>}
            <div
              className={styles.retrospectItem}
              data-testid={`retrospect-item-${retrospect.id}`}
            >
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
