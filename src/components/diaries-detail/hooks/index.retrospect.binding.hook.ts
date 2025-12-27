"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RetrospectData } from "./index.retrospect.form.hook";

/**
 * 회고 표시용 데이터 타입
 */
export interface RetrospectDisplayData {
  id: number;
  text: string;
  date: string;
  userId?: string; // 작성자 ID
}

/**
 * 회고 바인딩 Hook 반환 타입
 */
export interface RetrospectBindingHookReturn {
  retrospects: RetrospectDisplayData[];
}

/**
 * ISO 날짜 문자열을 "YYYY. MM. DD" 형식으로 변환
 * @param dateString - ISO 날짜 문자열 (예: "2024-09-24T00:00:00.000Z")
 * @returns 포맷된 날짜 문자열 (예: "2024. 09. 24")
 */
const formatRetrospectDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}. ${month}. ${day}`;
  } catch (error) {
    console.error("회고 날짜 포맷팅 중 오류 발생:", error);
    return dateString;
  }
};

/**
 * 회고 데이터 바인딩 Hook
 *
 * 다이나믹 라우팅된 [id]를 추출하여 로컬스토리지의 retrospects 배열에서
 * diaryId가 일치하는 회고들을 필터링하여 반환합니다.
 *
 * @returns {RetrospectBindingHookReturn} 필터링된 회고 목록
 * - retrospects: diaryId가 일치하는 회고 목록 (시간순 정렬)
 */
export const useRetrospectBindingHook = (): RetrospectBindingHookReturn => {
  const params = useParams();
  const [retrospects, setRetrospects] = useState<RetrospectDisplayData[]>([]);

  useEffect(() => {
    // [id] 추출
    const id = params?.id;
    if (!id) {
      setRetrospects([]);
      return;
    }

    // id를 number로 변환 (string[]인 경우 첫 번째 요소 사용)
    const idString = Array.isArray(id) ? id[0] : id;
    const diaryId =
      typeof idString === "string" ? parseInt(idString, 10) : idString;
    if (isNaN(diaryId)) {
      setRetrospects([]);
      return;
    }

    // 회고 데이터 로드 함수
    const loadRetrospects = () => {
      try {
        // 로컬스토리지에서 retrospects 배열 읽기
        const retrospectsJson = localStorage.getItem("retrospects");
        if (!retrospectsJson) {
          setRetrospects([]);
          return;
        }

        const allRetrospects: RetrospectData[] = JSON.parse(retrospectsJson);

        // diaryId가 일치하는 회고들 필터링
        const filteredRetrospects = allRetrospects.filter(
          (r) => r.diaryId === diaryId
        );

        // 시간순으로 정렬 (createdAt 기준 오름차순)
        const sortedRetrospects = [...filteredRetrospects].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateA - dateB;
        });

        // 표시용 데이터로 변환
        const displayRetrospects: RetrospectDisplayData[] =
          sortedRetrospects.map((r) => ({
            id: r.id,
            text: r.content,
            date: formatRetrospectDate(r.createdAt),
            userId: r.userId, // 작성자 ID 전달
          }));

        setRetrospects(displayRetrospects);
      } catch (error) {
        console.error("회고 데이터 조회 중 오류 발생:", error);
        setRetrospects([]);
      }
    };

    // 초기 로드
    loadRetrospects();

    // storage 이벤트 리스너 추가 (다른 탭에서의 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "retrospects") {
        loadRetrospects();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // 커스텀 이벤트 리스너 추가 (같은 탭에서의 변경 감지)
    const handleCustomStorageChange = () => {
      loadRetrospects();
    };

    window.addEventListener("localStorageChange", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleCustomStorageChange);
    };
  }, [params?.id]);

  return {
    retrospects,
  };
};

