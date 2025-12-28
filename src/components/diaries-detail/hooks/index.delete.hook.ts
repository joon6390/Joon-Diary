"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { paths } from "@/commons/constants/url";
import { DiaryData } from "./index.binding.hook";
import { useDeleteDiary } from "@/commons/hooks/use-diaries";

/**
 * 일기 삭제 Hook 반환 타입
 */
export interface DiaryDeleteHookReturn {
  handleDelete: () => void;
}

/**
 * 일기 삭제 Hook
 *
 * 삭제 확인 시 API를 통해 해당 일기를 제거한 후 /diaries로 이동합니다.
 *
 * @param diary - 삭제할 일기 데이터
 * @returns {DiaryDeleteHookReturn} 삭제 핸들러
 */
export const useDeleteHook = (
  diary: DiaryData | null
): DiaryDeleteHookReturn => {
  const router = useRouter();
  const deleteDiary = useDeleteDiary();

  /**
   * 일기 삭제 처리
   * API를 통해 해당 일기를 제거하고 /diaries로 이동합니다.
   */
  const handleDelete = useCallback(async () => {
    if (!diary) {
      return;
    }

    try {
      // API를 통해 일기 삭제
      await deleteDiary.mutateAsync(diary.id);

      // /diaries 페이지로 이동
      router.push(paths.diaries.list);
    } catch (error) {
      console.error("일기 삭제 중 오류 발생:", error);
      alert("일기 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  }, [diary, deleteDiary, router]);

  return {
    handleDelete,
  };
};

