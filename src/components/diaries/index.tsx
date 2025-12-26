"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { SelectBox } from "@/commons/components/selectbox";
import { SearchBar } from "@/commons/components/searchbar";
import { Button } from "@/commons/components/button";
import { Pagination } from "@/commons/components/pagination";
import Image from "next/image";
import { useLinkModal } from "./hooks/index.link.modal.hook";
import { useBindingHook, DiaryCardData } from "./hooks/index.binding.hook";
import { useLinkRouting } from "./hooks/index.link.routing.hook";
import { useSearchHook } from "./hooks/index.search.hook";

// 일기 카드 컴포넌트
interface DiaryCardProps {
  diary: DiaryCardData;
  onDelete: (id: number) => void;
  onCardClick: (id: number) => void;
}

function DiaryCard({ diary, onDelete, onCardClick }: DiaryCardProps) {
  const imageUrl = `/images/${diary.emotionImage}`;

  const handleCardClick = () => {
    onCardClick(diary.id);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 삭제 버튼 클릭 시 카드 클릭 이벤트 전파 방지
    onDelete(diary.id);
  };

  return (
    <div
      className={styles.diaryCard}
      data-testid={`diary-card-${diary.id}`}
      onClick={handleCardClick}
    >
      <div className={styles.imageWrapper}>
        <div className={styles.imageButtonRow}>
          <button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            aria-label="삭제"
          >
            <Image
              src="/icons/close_outline_light_m.svg"
              alt="close"
              width={40}
              height={40}
              className={styles.deleteIcon}
            />
          </button>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src={imageUrl}
            alt={diary.title}
            width={274}
            height={208}
            className={styles.diaryImage}
            data-testid="diary-emotion-image"
          />
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <span
            className={styles.emotionText}
            style={{ color: diary.emotionColor }}
            data-testid="diary-emotion-text"
          >
            {diary.emotionLabel}
          </span>
          <span className={styles.dateText} data-testid="diary-date">
            {diary.formattedDate}
          </span>
        </div>
        <div className={styles.cardTitle} data-testid="diary-title">
          {diary.title}
        </div>
      </div>
    </div>
  );
}

export default function Diaries() {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 5;

  // 일기쓰기 모달 hook
  const { handleWriteDiary } = useLinkModal();

  // 일기 데이터 바인딩 hook
  const { diaries, isLoading, refreshDiaries } = useBindingHook();

  // 일기 검색 hook
  const { filteredDiaries, handleSearch } = useSearchHook(diaries);

  // 일기 카드 라우팅 hook
  const { navigateToDiaryDetail } = useLinkRouting();

  const filterOptions = [
    { value: "all", label: "전체" },
    { value: "recent", label: "최신순" },
    { value: "oldest", label: "오래된순" },
  ];

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const handleDeleteDiary = (id: number) => {
    // 로컬스토리지에서 해당 일기 삭제
    try {
      const diariesJson = localStorage.getItem("diaries");
      if (diariesJson) {
        const allDiaries = JSON.parse(diariesJson);
        const updatedDiaries = allDiaries.filter(
          (diary: { id: number }) => diary.id !== id
        );
        localStorage.setItem("diaries", JSON.stringify(updatedDiaries));
        // hook의 refresh 함수를 호출하여 데이터 갱신
        refreshDiaries();
      }
    } catch (error) {
      console.error("일기 삭제 중 오류 발생:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container} data-testid="diaries-container">
      <div className={styles.gap1} />
      <div className={styles.search}>
        <div className={styles.searchLeft}>
          <SelectBox
            options={filterOptions}
            value={selectedFilter}
            onChange={handleFilterChange}
            placeholder="전체"
            variant="primary"
            size="medium"
            theme="light"
            className={styles.selectbox}
          />
          <SearchBar
            variant="primary"
            size="medium"
            theme="light"
            placeholder="검색어를 입력해 주세요."
            onSearch={handleSearch}
            className={styles.searchbar}
            data-testid="diary-search-input"
          />
        </div>
        <Button
          variant="primary"
          size="large"
          theme="light"
          onClick={handleWriteDiary}
          className={styles.writeButton}
          data-testid="write-diary-button"
        >
          <Image
            src="/icons/plus_outline_light_m.svg"
            alt="add"
            width={24}
            height={24}
            className={styles.addIcon}
          />
          일기쓰기
        </Button>
      </div>
      <div className={styles.gap2} />
      <div className={styles.main}>
        {isLoading ? (
          <div>로딩 중...</div>
        ) : (
          filteredDiaries.map((diary) => (
            <DiaryCard
              key={diary.id}
              diary={diary}
              onDelete={handleDeleteDiary}
              onCardClick={navigateToDiaryDetail}
            />
          ))
        )}
      </div>
      <div className={styles.gap3} />
      <div className={styles.pagination}>
        <Pagination
          variant="primary"
          size="medium"
          theme="light"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          maxVisiblePages={5}
        />
      </div>
      <div className={styles.gap4} />
    </div>
  );
}
