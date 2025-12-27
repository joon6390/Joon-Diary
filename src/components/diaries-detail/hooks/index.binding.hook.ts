"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EmotionType } from "@/commons/constants/enum";

/**
 * 일기 데이터 타입
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
  userId?: string; // 작성자 ID (선택적 필드, 기존 데이터 호환성 유지)
}

/**
 * 일기 상세 페이지 데이터 바인딩 Hook 반환 타입
 */
export interface DiaryDetailBindingHookReturn {
  diary: DiaryData | null;
  isLoading: boolean;
  formattedDate: string | null;
}

/**
 * ISO 날짜 문자열을 "YYYY. MM. DD" 형식으로 변환
 * @param dateString - ISO 날짜 문자열 (예: "2025-12-22T08:57:49.537Z")
 * @returns 포맷된 날짜 문자열 (예: "2025. 12. 22")
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}. ${month}. ${day}`;
  } catch (error) {
    console.error("날짜 포맷팅 중 오류 발생:", error);
    return dateString;
  }
};

/**
 * 일기 상세 페이지 데이터 바인딩 Hook
 * 
 * 다이나믹 라우팅된 [id]를 추출하여 로컬스토리지에서 일기 데이터를 조회합니다.
 * 
 * @returns {DiaryDetailBindingHookReturn} 일기 데이터 및 로딩 상태
 * - diary: 조회된 일기 데이터 (없으면 null)
 * - isLoading: 데이터 로딩 중 여부
 */
// 초기 데이터 로드 함수 (동기적 실행)
const loadDiarySync = (diaryId: number): DiaryData | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // 로컬스토리지에서 diaries 배열 읽기
    const diariesJson = localStorage.getItem("diaries");
    if (!diariesJson) {
      return null;
    }

    const diaries: DiaryData[] = JSON.parse(diariesJson);

    // id와 일치하는 일기 찾기
    const foundDiary = diaries.find((d) => d.id === diaryId);

    return foundDiary || null;
  } catch (error) {
    console.error("일기 데이터 조회 중 오류 발생:", error);
    return null;
  }
};

export const useBindingHook = (): DiaryDetailBindingHookReturn => {
  const params = useParams();
  
  // 초기 diaryId 추출 및 데이터 로드
  const getInitialDiary = (): DiaryData | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const id = params?.id;
    if (!id) {
      return null;
    }

    const idString = Array.isArray(id) ? id[0] : id;
    const diaryId = typeof idString === "string" ? parseInt(idString, 10) : idString;
    if (isNaN(diaryId)) {
      return null;
    }

    return loadDiarySync(diaryId);
  };

  // 초기 데이터를 동기적으로 로드하여 렌더링 지연 최소화
  const [diary, setDiary] = useState<DiaryData | null>(() => getInitialDiary());
  const [isLoading] = useState<boolean>(false);

  // params.id 변경 시 데이터 다시 로드
  useEffect(() => {
    const id = params?.id;
    if (!id) {
      setDiary(null);
      return;
    }

    const idString = Array.isArray(id) ? id[0] : id;
    const diaryId = typeof idString === "string" ? parseInt(idString, 10) : idString;
    if (isNaN(diaryId)) {
      setDiary(null);
      return;
    }

    const loadedDiary = loadDiarySync(diaryId);
    setDiary(loadedDiary);
  }, [params?.id]);

  // 날짜 포맷팅
  const formattedDate = diary ? formatDate(diary.createdAt) : null;

  return {
    diary,
    isLoading,
    formattedDate,
  };
};

