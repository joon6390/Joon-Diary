"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import { SelectBox } from "@/commons/components/selectbox";
import { SearchBar } from "@/commons/components/searchbar";
import { Button } from "@/commons/components/button";
import { Pagination } from "@/commons/components/pagination";
import Image from "next/image";
import { EmotionType, getEmotionData } from "@/commons/constants/enum";

// Mock 일기 데이터 인터페이스
interface DiaryData {
  id: number;
  emotion: EmotionType;
  date: string;
  title: string;
}

// Mock 데이터 (emotion enum 타입 활용)
const mockDiaries: DiaryData[] = [
  {
    id: 1,
    emotion: EmotionType.Sad,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다.",
  },
  {
    id: 2,
    emotion: EmotionType.Surprise,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
  },
  {
    id: 3,
    emotion: EmotionType.Angry,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
  },
  {
    id: 4,
    emotion: EmotionType.Happy,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
  },
  {
    id: 5,
    emotion: EmotionType.Etc,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다.",
  },
  {
    id: 6,
    emotion: EmotionType.Surprise,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
  },
  {
    id: 7,
    emotion: EmotionType.Angry,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
  },
  {
    id: 8,
    emotion: EmotionType.Happy,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
  },
  {
    id: 9,
    emotion: EmotionType.Sad,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다. 한줄까지만 노출 됩니다.",
  },
  {
    id: 10,
    emotion: EmotionType.Surprise,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
  },
  {
    id: 11,
    emotion: EmotionType.Angry,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
  },
  {
    id: 12,
    emotion: EmotionType.Happy,
    date: "2024. 03. 12",
    title: "타이틀 영역 입니다.",
  },
];

// 일기 카드 컴포넌트
interface DiaryCardProps {
  diary: DiaryData;
  onDelete: (id: number) => void;
}

function DiaryCard({ diary, onDelete }: DiaryCardProps) {
  const emotionData = getEmotionData(diary.emotion);
  const imageUrl = `/images/${emotionData.images.medium}`;

  return (
    <div className={styles.diaryCard}>
      <div className={styles.imageWrapper}>
        <div className={styles.imageButtonRow}>
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(diary.id)}
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
          />
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <span className={styles.emotionText} style={{ color: emotionData.color }}>
            {emotionData.label}
          </span>
          <span className={styles.dateText}>{diary.date}</span>
        </div>
        <div className={styles.cardTitle}>{diary.title}</div>
      </div>
    </div>
  );
}

export default function Diaries() {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [diaries, setDiaries] = useState<DiaryData[]>(mockDiaries);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 5;

  const filterOptions = [
    { value: "all", label: "전체" },
    { value: "recent", label: "최신순" },
    { value: "oldest", label: "오래된순" },
  ];

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  const handleSearch = (value: string) => {
    console.log("검색:", value);
  };

  const handleWriteDiary = () => {
    console.log("일기쓰기 클릭");
  };

  const handleDeleteDiary = (id: number) => {
    setDiaries((prev) => prev.filter((diary) => diary.id !== id));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
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
          />
        </div>
        <Button
          variant="primary"
          size="large"
          theme="light"
          onClick={handleWriteDiary}
          className={styles.writeButton}
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
        {diaries.map((diary) => (
          <DiaryCard
            key={diary.id}
            diary={diary}
            onDelete={handleDeleteDiary}
          />
        ))}
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
