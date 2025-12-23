"use client";

import { useRouter } from "next/navigation";
import { paths } from "@/commons/constants/url";

/**
 * 일기 카드 라우팅 Hook 반환 타입
 */
export interface DiariesLinkRoutingReturn {
  navigateToDiaryDetail: (id: number) => void;
}

/**
 * 일기 카드 라우팅 Hook
 * 
 * 일기 카드 클릭 시 일기 상세 페이지로 이동하는 기능을 제공합니다.
 * 
 * @returns {DiariesLinkRoutingReturn} 라우팅 관련 함수
 * - navigateToDiaryDetail: 일기 상세 페이지로 이동하는 함수
 */
export const useLinkRouting = (): DiariesLinkRoutingReturn => {
  const router = useRouter();

  /**
   * 일기 상세 페이지로 이동
   * @param id - 일기 ID
   */
  const navigateToDiaryDetail = (id: number) => {
    router.push(paths.diaries.detail(id));
  };

  return {
    navigateToDiaryDetail,
  };
};

