"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { paths } from "@/commons/constants/url";
import { DiaryData } from "./index.binding.hook";

/**
 * 일기 삭제 Hook 반환 타입
 */
export interface DiaryDeleteHookReturn {
  handleDelete: () => void;
}

/**
 * 일기 삭제 Hook
 *
 * 삭제 확인 시 로컬스토리지에서 해당 일기를 제거한 후 /diaries로 이동합니다.
 *
 * @param diary - 삭제할 일기 데이터
 * @returns {DiaryDeleteHookReturn} 삭제 핸들러
 */
export const useDeleteHook = (
  diary: DiaryData | null
): DiaryDeleteHookReturn => {
  const router = useRouter();
  const params = useParams();

  /**
   * 일기 삭제 처리
   * 로컬스토리지에서 해당 일기를 제거하고 /diaries로 이동합니다.
   */
  const handleDelete = useCallback(() => {
    if (!diary || typeof window === "undefined") {
      return;
    }

    try {
      // 로컬스토리지에서 diaries 배열 읽기
      const diariesJson = localStorage.getItem("diaries");
      if (!diariesJson) {
        return;
      }

      const diaries: DiaryData[] = JSON.parse(diariesJson);

      // 현재 일기 id 추출
      const id = params?.id;
      if (!id) {
        return;
      }

      const idString = Array.isArray(id) ? id[0] : id;
      const diaryId = typeof idString === "string" ? parseInt(idString, 10) : idString;
      if (isNaN(diaryId)) {
        return;
      }

      // 해당 id와 일치하는 일기 제거
      const filteredDiaries = diaries.filter((d) => d.id !== diaryId);

      // 로컬스토리지에 업데이트된 배열 저장
      localStorage.setItem("diaries", JSON.stringify(filteredDiaries));

      // /diaries 페이지로 이동
      router.push(paths.diaries.list);
    } catch (error) {
      console.error("일기 삭제 중 오류 발생:", error);
    }
  }, [diary, params?.id, router]);

  return {
    handleDelete,
  };
};

