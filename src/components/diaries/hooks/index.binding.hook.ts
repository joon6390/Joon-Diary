"use client";

import { useEffect, useState } from "react";
import { EmotionType, getEmotionData } from "@/commons/constants/enum";

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
  userName?: string; // 작성자 이름 (선택적 필드, 기존 데이터 호환성 유지)
}

/**
 * 바인딩된 일기 카드 데이터 타입
 */
export interface DiaryCardData {
  id: number;
  title: string;
  content: string;
  emotion: EmotionType;
  createdAt: string;
  formattedDate: string;
  emotionLabel: string;
  emotionColor: string;
  emotionImage: string;
  userId?: string; // 작성자 ID
  userName?: string; // 작성자 이름
}

/**
 * 일기 목록 페이지 데이터 바인딩 Hook 반환 타입
 */
export interface DiariesBindingHookReturn {
  diaries: DiaryCardData[];
  isLoading: boolean;
  refreshDiaries: () => void;
}

/**
 * ISO 날짜 문자열을 "YYYY. MM. DD" 형식으로 변환
 * @param dateString - ISO 날짜 문자열 (예: "2024-07-12T08:57:49.537Z")
 * @returns 포맷된 날짜 문자열 (예: "2024. 07. 12")
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
 * 제목이 길 경우 말줄임 처리
 * @param title - 원본 제목
 * @param maxLength - 최대 길이 (선택사항)
 * @returns 말줄임 처리된 제목
 */
export const truncateTitle = (title: string, maxLength?: number): string => {
  // CSS text-overflow: ellipsis가 처리하므로, 여기서는 원본 반환
  // 필요시 maxLength로 제한할 수 있음
  if (maxLength && title.length > maxLength) {
    return title.substring(0, maxLength) + "...";
  }
  return title;
};

/**
 * 일기 목록 페이지 데이터 바인딩 Hook
 *
 * 로컬스토리지에서 diaries 배열을 읽어와서 카드 표시에 필요한 형태로 변환합니다.
 *
 * @returns {DiariesBindingHookReturn} 일기 목록 데이터 및 로딩 상태
 * - diaries: 바인딩된 일기 카드 데이터 배열
 * - isLoading: 데이터 로딩 중 여부
 * - refreshDiaries: 로컬스토리지에서 데이터를 다시 읽어오는 함수
 */
// 초기 데이터 로드 함수 (동기적 실행)
const loadDiariesSync = (): DiaryCardData[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    // 로컬스토리지에서 diaries 배열 읽기
    const diariesJson = localStorage.getItem("diaries");
    if (!diariesJson) {
      return [];
    }

    const rawDiaries: DiaryData[] = JSON.parse(diariesJson);

    // 각 일기 데이터를 카드 표시용 형태로 변환
    const cardData: DiaryCardData[] = rawDiaries.map((diary) => {
      const emotionData = getEmotionData(diary.emotion);

      return {
        id: diary.id,
        title: diary.title,
        content: diary.content,
        emotion: diary.emotion,
        createdAt: diary.createdAt,
        formattedDate: formatDate(diary.createdAt),
        emotionLabel: emotionData.label,
        emotionColor: emotionData.color,
        emotionImage: emotionData.images.medium,
        userId: diary.userId, // 작성자 ID 전달
        userName: diary.userName, // 작성자 이름 전달
      };
    });

    return cardData;
  } catch (error) {
    console.error("일기 데이터 조회 중 오류 발생:", error);
    return [];
  }
};

export const useBindingHook = (): DiariesBindingHookReturn => {
  // 초기 데이터를 동기적으로 로드하여 렌더링 지연 최소화
  const [diaries, setDiaries] = useState<DiaryCardData[]>(() =>
    loadDiariesSync()
  );
  const [isLoading] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // refreshTrigger 변경 시 데이터 다시 로드
  useEffect(() => {
    if (refreshTrigger > 0) {
      const loadedDiaries = loadDiariesSync();
      setDiaries(loadedDiaries);
    }
  }, [refreshTrigger]);

  const refreshDiaries = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return {
    diaries,
    isLoading,
    refreshDiaries,
  };
};
