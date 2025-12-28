"use client";

import { useParams } from "next/navigation";
import { useRetrospects } from "@/commons/hooks/use-retrospects";

/**
 * 회고 표시용 데이터 타입
 */
export interface RetrospectDisplayData {
  id: number;
  text: string;
  date: string;
  userId?: string; // 작성자 ID
  userName?: string; // 작성자 이름
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
 * 다이나믹 라우팅된 [id]를 추출하여 API에서 diaryId가 일치하는 회고들을 조회하여 반환합니다.
 *
 * @returns {RetrospectBindingHookReturn} 필터링된 회고 목록
 * - retrospects: diaryId가 일치하는 회고 목록 (시간순 정렬)
 */
export const useRetrospectBindingHook = (): RetrospectBindingHookReturn => {
  const params = useParams();

  // [id] 추출
  const id = params?.id;
  const idString = id ? (Array.isArray(id) ? id[0] : id) : undefined;
  const diaryIdNumber: number | undefined =
    idString && typeof idString === "string"
      ? parseInt(idString, 10)
      : typeof idString === "number"
      ? idString
      : undefined;

  // API에서 회고 데이터 조회
  const { data: rawRetrospects = [] } = useRetrospects(
    diaryIdNumber && !isNaN(diaryIdNumber) ? diaryIdNumber : undefined
  );

  // 시간순으로 정렬 (createdAt 기준 오름차순)
  const sortedRetrospects = [...rawRetrospects].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });

  // 표시용 데이터로 변환
  const retrospects: RetrospectDisplayData[] = sortedRetrospects.map((r) => ({
    id: r.id,
    text: r.content,
    date: formatRetrospectDate(r.createdAt),
    userId: r.userId, // 작성자 ID 전달
    userName: r.userName, // 작성자 이름 전달
  }));

  return {
    retrospects,
  };
};

