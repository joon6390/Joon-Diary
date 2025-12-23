"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * 강아지 이미지 API 응답 타입
 */
export interface DogApiResponse {
  message: string[];
  status: string;
}

/**
 * 강아지 이미지 데이터 타입
 */
export interface DogImageData {
  id: number;
  src: string;
  alt: string;
}

/**
 * 바인딩 Hook 반환 타입
 */
export interface PicturesBindingHookReturn {
  dogs: DogImageData[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error: Error | null;
}

/**
 * 강아지 목록 조회 API 함수
 * @param _pageParam - 페이지 파라미터 (현재는 사용하지 않음)
 * @returns 강아지 이미지 URL 배열
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchDogs = async (_pageParam: number = 0): Promise<string[]> => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random/6");
  
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  const data: DogApiResponse = await response.json();
  
  if (data.status !== "success" || !Array.isArray(data.message)) {
    throw new Error("API 응답 형식이 올바르지 않습니다.");
  }

  return data.message;
};

/**
 * 강아지 사진 목록 페이지 데이터 바인딩 Hook
 *
 * dog.ceo API를 사용하여 강아지 이미지를 조회하고,
 * 무한 스크롤 기능을 제공합니다.
 *
 * @returns {PicturesBindingHookReturn} 강아지 이미지 데이터 및 로딩 상태
 * - dogs: 강아지 이미지 데이터 배열
 * - isLoading: 초기 로딩 중 여부
 * - isFetchingNextPage: 다음 페이지 로딩 중 여부
 * - hasNextPage: 다음 페이지 존재 여부
 * - fetchNextPage: 다음 페이지 로드 함수
 * - error: 에러 상태
 */
export const useBindingHook = (): PicturesBindingHookReturn => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["dogs"],
    queryFn: ({ pageParam = 0 }) => fetchDogs(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 항상 다음 페이지가 있다고 가정 (무한 스크롤)
      return allPages.length;
    },
    staleTime: 60 * 1000, // 1분
  });

  // 모든 페이지의 강아지 이미지를 하나의 배열로 합치기
  const dogs: DogImageData[] = data?.pages.flatMap((page, pageIndex) =>
    page.map((src, index) => ({
      id: pageIndex * 6 + index,
      src,
      alt: `강아지 사진 ${pageIndex * 6 + index + 1}`,
    }))
  ) ?? [];

  return {
    dogs,
    isLoading,
    isFetchingNextPage,
    hasNextPage: hasNextPage ?? true,
    fetchNextPage,
    error: error as Error | null,
  };
};

