"use client";

import { useState, useEffect } from "react";
import { PictureFilterType } from "@/commons/constants/enum";

/**
 * 필터 타입
 */
export type FilterType = PictureFilterType;

/**
 * 이미지 크기 인터페이스
 */
export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Pictures Filter Hook 반환 타입
 */
export interface PicturesFilterHookReturn {
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  imageSize: ImageSize;
}

/**
 * 필터 타입에 따른 데스크톱 이미지 크기 매핑
 */
const FILTER_IMAGE_SIZE_MAP_DESKTOP: Record<FilterType, ImageSize> = {
  [PictureFilterType.Default]: { width: 640, height: 640 },
  [PictureFilterType.Horizontal]: { width: 640, height: 480 },
  [PictureFilterType.Vertical]: { width: 480, height: 640 },
};

/**
 * 필터 타입에 따른 모바일 이미지 크기 매핑 (767px 이하)
 */
const FILTER_IMAGE_SIZE_MAP_MOBILE: Record<FilterType, ImageSize> = {
  [PictureFilterType.Default]: { width: 280, height: 280 },
  [PictureFilterType.Horizontal]: { width: 280, height: 210 },
  [PictureFilterType.Vertical]: { width: 280, height: 372 },
};

/**
 * 브레이크포인트
 */
const BREAKPOINT = 767;

/**
 * 강아지 사진 필터 Hook
 *
 * 필터 타입에 따라 이미지 크기를 관리하는 Hook
 * 데스크톱: 기본(640x640), 가로형(640x480), 세로형(480x640)
 * 모바일(767px 이하): 기본(280x280), 가로형(280x210), 세로형(280x372)
 *
 * @param initialFilter - 초기 필터 타입 (기본값: PictureFilterType.Default)
 * @returns {PicturesFilterHookReturn} 필터 상태 및 이미지 크기 정보
 * - filterType: 현재 선택된 필터 타입
 * - setFilterType: 필터 타입을 변경하는 함수
 * - imageSize: 현재 필터 타입 및 화면 크기에 해당하는 이미지 크기
 */
export const useFilterHook = (
  initialFilter: FilterType = PictureFilterType.Default
): PicturesFilterHookReturn => {
  const [filterType, setFilterType] = useState<FilterType>(initialFilter);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const imageSize = isMobile
    ? FILTER_IMAGE_SIZE_MAP_MOBILE[filterType]
    : FILTER_IMAGE_SIZE_MAP_DESKTOP[filterType];

  return {
    filterType,
    setFilterType,
    imageSize,
  };
};
