"use client";

import React from "react";
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
import { useFilterHook } from "./hooks/index.filter.hook";
import { usePaginationHook } from "./hooks/index.pagination.hook";
import { useDeleteHook } from "./hooks/index.delete.hook";
import { EmotionType, emotionDataMap } from "@/commons/constants/enum";
import { useAuth } from "@/commons/providers/auth/auth.provider";

// 일기 카드 컴포넌트
interface DiaryCardProps {
  diary: DiaryCardData;
  onDelete: (id: number) => void;
  onCardClick: (id: number) => void;
  isLoggedIn: boolean;
}

function DiaryCard({
  diary,
  onDelete,
  onCardClick,
  isLoggedIn,
}: DiaryCardProps) {
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
        {isLoggedIn && (
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
        )}
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
  // 일기쓰기 모달 hook
  const { handleWriteDiary } = useLinkModal();

  // 일기 데이터 바인딩 hook
  const { diaries, isLoading } = useBindingHook();

  // 일기 검색 hook
  const { filteredDiaries: searchFilteredDiaries, handleSearch } =
    useSearchHook(diaries);

  // 일기 필터 hook (검색 결과에 필터 적용)
  const { filteredDiaries, handleFilterChange, selectedFilter } = useFilterHook(
    searchFilteredDiaries
  );

  // 일기 페이지네이션 hook (필터 결과에 페이지네이션 적용)
  const { paginatedDiaries, currentPage, totalPages, handlePageChange } =
    usePaginationHook(filteredDiaries);

  // 일기 카드 라우팅 hook
  const { navigateToDiaryDetail } = useLinkRouting();

  // 일기 삭제 hook
  const { handleDeleteDiary } = useDeleteHook();

  // 로그인 상태 확인
  const { checkLoginStatus } = useAuth();
  const isLoggedIn = checkLoginStatus();

  // emotion 필터 옵션
  const filterOptions = [
    { value: "all", label: "전체" },
    {
      value: EmotionType.Happy,
      label: emotionDataMap[EmotionType.Happy].label,
    },
    { value: EmotionType.Sad, label: emotionDataMap[EmotionType.Sad].label },
    {
      value: EmotionType.Surprise,
      label: emotionDataMap[EmotionType.Surprise].label,
    },
    {
      value: EmotionType.Angry,
      label: emotionDataMap[EmotionType.Angry].label,
    },
  ];

  const handleFilterSelectChange = (value: string) => {
    if (value === "all") {
      handleFilterChange("all");
    } else {
      handleFilterChange(value as EmotionType);
    }
  };

  return (
    <div className={styles.container} data-testid="diaries-container">
      <div className={styles.gap1} />
      <div className={styles.search}>
        {/* 데스크톱 버전 (768px 이상) */}
        <div className={styles.searchDesktop}>
          <div className={styles.searchLeft}>
            <SelectBox
              options={filterOptions}
              value={selectedFilter === "all" ? "all" : selectedFilter}
              onChange={handleFilterSelectChange}
              placeholder="전체"
              variant="primary"
              size="medium"
              theme="light"
              className={styles.selectbox}
              testId="diary-filter-selectbox"
              optionTestId={(value) => `diary-filter-option-${value}`}
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
        {/* 모바일 버전 (767px 이하) */}
        <div className={styles.searchMobile}>
          <SearchBar
            variant="primary"
            size="medium"
            theme="light"
            placeholder="검색어를 입력해 주세요."
            onSearch={handleSearch}
            className={styles.searchbarMobile}
            data-testid="diary-search-input-mobile"
          />
          <div className={styles.searchBottom}>
            <SelectBox
              options={filterOptions}
              value={selectedFilter === "all" ? "all" : selectedFilter}
              onChange={handleFilterSelectChange}
              placeholder="전체"
              variant="primary"
              size="medium"
              theme="light"
              className={styles.selectboxMobile}
              testId="diary-filter-selectbox-mobile"
              optionTestId={(value) => `diary-filter-option-mobile-${value}`}
            />
            <Button
              variant="primary"
              size="large"
              theme="light"
              onClick={handleWriteDiary}
              className={styles.writeButtonMobile}
              data-testid="write-diary-button-mobile"
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
        </div>
      </div>
      <div className={styles.gap2} />
      <div className={styles.main}>
        {isLoading ? (
          <div>로딩 중...</div>
        ) : paginatedDiaries.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateText}>등록된 일기가 없습니다.</div>
          </div>
        ) : (
          paginatedDiaries.map((diary) => (
            <DiaryCard
              key={diary.id}
              diary={diary}
              onDelete={handleDeleteDiary}
              onCardClick={navigateToDiaryDetail}
              isLoggedIn={isLoggedIn}
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
