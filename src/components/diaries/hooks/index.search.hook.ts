"use client";

import { useState, useCallback, useMemo } from "react";
import { DiaryCardData } from "./index.binding.hook";

/**
 * 일기 검색 Hook 반환 타입
 */
export interface DiariesSearchHookReturn {
  filteredDiaries: DiaryCardData[];
  handleSearch: (query: string) => void;
}

/**
 * 일기 검색 Hook
 *
 * 로컬스토리지에서 diaries 배열을 읽어와서 검색어에 따라 필터링합니다.
 * 검색 조건: title이 검색어에 포함되는 일기카드
 *
 * @param allDiaries - 전체 일기 목록 (DiaryCardData[])
 * @returns {DiariesSearchHookReturn} 검색 관련 상태 및 함수
 * - filteredDiaries: 필터링된 일기 카드 데이터 배열
 * - handleSearch: 검색어를 설정하는 함수
 */
export const useSearchHook = (
  allDiaries: DiaryCardData[]
): DiariesSearchHookReturn => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  /**
   * 검색어에 따라 일기를 필터링
   */
  const filteredDiaries = useMemo(() => {
    if (!searchQuery.trim()) {
      return allDiaries;
    }

    const query = searchQuery.trim().toLowerCase();
    return allDiaries.filter((diary) =>
      diary.title.toLowerCase().includes(query)
    );
  }, [searchQuery, allDiaries]);

  /**
   * 검색어를 설정하는 함수
   * @param query - 검색어
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    filteredDiaries,
    handleSearch,
  };
};

