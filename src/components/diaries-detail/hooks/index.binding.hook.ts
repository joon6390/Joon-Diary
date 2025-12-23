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
}

/**
 * 일기 상세 페이지 데이터 바인딩 Hook 반환 타입
 */
export interface DiaryDetailBindingHookReturn {
  diary: DiaryData | null;
  isLoading: boolean;
}

/**
 * 일기 상세 페이지 데이터 바인딩 Hook
 * 
 * 다이나믹 라우팅된 [id]를 추출하여 로컬스토리지에서 일기 데이터를 조회합니다.
 * 
 * @returns {DiaryDetailBindingHookReturn} 일기 데이터 및 로딩 상태
 * - diary: 조회된 일기 데이터 (없으면 null)
 * - isLoading: 데이터 로딩 중 여부
 */
export const useBindingHook = (): DiaryDetailBindingHookReturn => {
  const params = useParams();
  const [diary, setDiary] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // [id] 추출
    const id = params?.id;
    if (!id) {
      setIsLoading(false);
      return;
    }

    // id를 number로 변환 (string[]인 경우 첫 번째 요소 사용)
    const idString = Array.isArray(id) ? id[0] : id;
    const diaryId = typeof idString === "string" ? parseInt(idString, 10) : idString;
    if (isNaN(diaryId)) {
      setIsLoading(false);
      return;
    }

    try {
      // 로컬스토리지에서 diaries 배열 읽기
      const diariesJson = localStorage.getItem("diaries");
      if (!diariesJson) {
        setDiary(null);
        setIsLoading(false);
        return;
      }

      const diaries: DiaryData[] = JSON.parse(diariesJson);

      // id와 일치하는 일기 찾기
      const foundDiary = diaries.find((d) => d.id === diaryId);

      setDiary(foundDiary || null);
    } catch (error) {
      console.error("일기 데이터 조회 중 오류 발생:", error);
      setDiary(null);
    } finally {
      setIsLoading(false);
    }
  }, [params?.id]);

  return {
    diary,
    isLoading,
  };
};

