"use client";

import { useParams } from "next/navigation";
import { EmotionType } from "@/commons/constants/enum";
import { useDiaries } from "@/commons/hooks/use-diaries";

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
 * 다이나믹 라우팅된 [id]를 추출하여 API에서 일기 데이터를 조회합니다.
 * 
 * @returns {DiaryDetailBindingHookReturn} 일기 데이터 및 로딩 상태
 * - diary: 조회된 일기 데이터 (없으면 null)
 * - isLoading: 데이터 로딩 중 여부
 */
export const useBindingHook = (): DiaryDetailBindingHookReturn => {
  const params = useParams();
  const { data: diaries, isLoading } = useDiaries();

  // diaryId 추출
  const id = params?.id;
  const idString = id ? (Array.isArray(id) ? id[0] : id) : null;
  const diaryId = idString ? (typeof idString === "string" ? parseInt(idString, 10) : idString) : null;

  // 일기 찾기
  const diary = diaryId && diaries
    ? diaries.find((d) => d.id === diaryId) || null
    : null;

  // 날짜 포맷팅
  const formattedDate = diary ? formatDate(diary.createdAt) : null;

  return {
    diary,
    isLoading,
    formattedDate,
  };
};

