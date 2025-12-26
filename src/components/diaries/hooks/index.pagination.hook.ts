"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DiaryCardData } from "./index.binding.hook";

/**
 * 페이지네이션 Hook 반환 타입
 */
export interface DiariesPaginationHookReturn {
  paginatedDiaries: DiaryCardData[];
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

/**
 * 일기 페이지네이션 Hook
 *
 * 필터링된 일기 목록을 페이지 단위로 나누어 표시합니다.
 * 한 페이지에 12개(3행 4열)의 일기 카드를 표시합니다.
 *
 * @param filteredDiaries - 필터링된 일기 목록 (DiaryCardData[])
 * @returns {DiariesPaginationHookReturn} 페이지네이션 관련 상태 및 함수
 * - paginatedDiaries: 현재 페이지에 표시할 일기 카드 데이터 배열
 * - currentPage: 현재 페이지 번호
 * - totalPages: 전체 페이지 수
 * - handlePageChange: 페이지를 변경하는 함수
 */
export const usePaginationHook = (
  filteredDiaries: DiaryCardData[]
): DiariesPaginationHookReturn => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const prevLengthRef = useRef<number>(filteredDiaries.length);

  /**
   * 한 페이지에 표시할 일기 개수 (3행 4열 = 12개)
   */
  const ITEMS_PER_PAGE = 12;

  /**
   * 전체 페이지 수 계산
   */
  const totalPages = useMemo(() => {
    if (filteredDiaries.length === 0) {
      return 1;
    }
    return Math.ceil(filteredDiaries.length / ITEMS_PER_PAGE);
  }, [filteredDiaries.length]);

  /**
   * 현재 페이지에 표시할 일기 목록
   */
  const paginatedDiaries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredDiaries.slice(startIndex, endIndex);
  }, [filteredDiaries, currentPage]);

  /**
   * 필터링된 일기 목록이 변경되면 첫 페이지로 리셋
   * 또는 현재 페이지가 새로운 totalPages를 초과하면 마지막 페이지로 조정
   */
  useEffect(() => {
    const newTotalPages = filteredDiaries.length === 0 
      ? 1 
      : Math.ceil(filteredDiaries.length / ITEMS_PER_PAGE);
    
    // 필터링된 일기 목록의 길이가 변경되었을 때만 처리
    if (prevLengthRef.current !== filteredDiaries.length) {
      setCurrentPage((prevPage) => {
        if (prevPage > newTotalPages) {
          // 현재 페이지가 새로운 totalPages를 초과하면 마지막 페이지로 조정
          return newTotalPages;
        } else {
          // 필터링/검색이 변경되었을 때 첫 페이지로 리셋
          return 1;
        }
      });
      prevLengthRef.current = filteredDiaries.length;
    } else {
      // 길이는 같지만 현재 페이지가 totalPages를 초과하는 경우 조정
      setCurrentPage((prevPage) => {
        if (prevPage > newTotalPages) {
          return newTotalPages;
        }
        return prevPage;
      });
    }
  }, [filteredDiaries.length]);

  /**
   * 페이지를 변경하는 함수
   * @param page - 이동할 페이지 번호
   */
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  return {
    paginatedDiaries,
    currentPage,
    totalPages,
    handlePageChange,
  };
};

