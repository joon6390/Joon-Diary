"use client";

import { usePathname, useRouter } from "next/navigation";
import { paths } from "@/commons/constants/url";

/**
 * Layout Link Routing Hook 반환 타입
 */
export interface LayoutLinkRoutingReturn {
  navigateToDiaries: () => void;
  navigateToPictures: () => void;
  isDiariesActive: boolean;
  isPicturesActive: boolean;
}

/**
 * Layout Link Routing Hook
 * 
 * Layout 컴포넌트의 링크 라우팅 및 액티브 상태 관리를 위한 커스텀 훅
 * 
 * @returns {LayoutLinkRoutingReturn} 라우팅 관련 함수와 상태
 * - navigateToDiaries: 일기목록 페이지로 이동하는 함수
 * - navigateToPictures: 사진목록 페이지로 이동하는 함수
 * - isDiariesActive: 일기보관함 탭의 액티브 상태
 * - isPicturesActive: 사진보관함 탭의 액티브 상태
 */
export const useLayoutLinkRouting = (): LayoutLinkRoutingReturn => {
  const pathname = usePathname();
  const router = useRouter();

  /**
   * 일기목록 페이지로 이동
   */
  const navigateToDiaries = () => {
    router.push(paths.diaries.list);
  };

  /**
   * 사진목록 페이지로 이동
   */
  const navigateToPictures = () => {
    router.push(paths.pictures.list);
  };

  /**
   * 일기보관함 탭의 액티브 상태 판단
   * /diaries 경로이거나 /diaries/:id 형태의 경로인 경우 active
   */
  const isDiariesActive = pathname === paths.diaries.list || pathname.startsWith("/diaries/");

  /**
   * 사진보관함 탭의 액티브 상태 판단
   * /pictures 경로인 경우 active
   */
  const isPicturesActive = pathname === paths.pictures.list;

  return {
    navigateToDiaries,
    navigateToPictures,
    isDiariesActive,
    isPicturesActive,
  };
};

