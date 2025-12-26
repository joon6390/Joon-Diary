"use client";

import { useState } from "react";
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
 * 필터 타입에 따른 이미지 크기 매핑
 */
const FILTER_IMAGE_SIZE_MAP: Record<FilterType, ImageSize> = {
  [PictureFilterType.Default]: { width: 640, height: 640 },
  [PictureFilterType.Horizontal]: { width: 640, height: 480 },
  [PictureFilterType.Vertical]: { width: 480, height: 640 },
};

/**
 * 강아지 사진 필터 Hook
 *
 * 필터 타입에 따라 이미지 크기를 관리하는 Hook
 * 기본(640x640), 가로형(640x480), 세로형(480x640) 필터를 제공합니다.
 *
 * @param initialFilter - 초기 필터 타입 (기본값: PictureFilterType.Default)
 * @returns {PicturesFilterHookReturn} 필터 상태 및 이미지 크기 정보
 * - filterType: 현재 선택된 필터 타입
 * - setFilterType: 필터 타입을 변경하는 함수
 * - imageSize: 현재 필터 타입에 해당하는 이미지 크기
 */
export const useFilterHook = (
  initialFilter: FilterType = PictureFilterType.Default
): PicturesFilterHookReturn => {
  const [filterType, setFilterType] = useState<FilterType>(initialFilter);

  const imageSize = FILTER_IMAGE_SIZE_MAP[filterType];

  return {
    filterType,
    setFilterType,
    imageSize,
  };
};
