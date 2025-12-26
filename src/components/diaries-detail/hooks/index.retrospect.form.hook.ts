"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";

/**
 * 회고 폼 스키마
 */
const retrospectFormSchema = z.object({
  content: z.string().min(1, "회고를 입력해주세요."),
});

type RetrospectFormData = z.infer<typeof retrospectFormSchema>;

/**
 * 로컬스토리지에 저장되는 회고 데이터 타입
 */
export interface RetrospectData {
  id: number;
  content: string;
  diaryId: number;
  createdAt: string;
}

/**
 * 회고 작성 폼 Hook 반환 타입
 */
export interface RetrospectFormHookReturn {
  control: ReturnType<typeof useForm<RetrospectFormData>>["control"];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: ReturnType<typeof useForm<RetrospectFormData>>["formState"]["errors"];
  isSubmitDisabled: boolean;
}

/**
 * 회고 작성 폼 Hook
 *
 * react-hook-form과 zod를 사용한 회고 작성 폼 관리
 * 로컬스토리지에 회고를 저장하고 등록 완료시 페이지를 새로고침
 *
 * @returns {RetrospectFormHookReturn} 폼 관리 함수 및 상태
 * - control: 폼 필드 제어 객체
 * - handleSubmit: 폼 제출 핸들러
 * - errors: 폼 검증 에러
 * - isSubmitDisabled: 제출 버튼 비활성화 여부
 */
export const useRetrospectFormHook = (): RetrospectFormHookReturn => {
  const params = useParams();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<RetrospectFormData>({
    resolver: zodResolver(retrospectFormSchema),
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  // content 필드 값 감시 (watch로 리렌더링 트리거 및 값 가져오기)
  const content = watch("content") || "";
  // 값이 1글자 이상이면 활성화 (zod validation: min(1))
  const isContentFilled = content.trim().length > 0;

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = (data: RetrospectFormData) => {
    // diaryId 추출
    const id = params?.id;
    if (!id) {
      console.error("diaryId를 찾을 수 없습니다.");
      return;
    }

    // id를 number로 변환 (string[]인 경우 첫 번째 요소 사용)
    const idString = Array.isArray(id) ? id[0] : id;
    const diaryId =
      typeof idString === "string" ? parseInt(idString, 10) : idString;
    if (isNaN(diaryId)) {
      console.error("유효하지 않은 diaryId입니다.");
      return;
    }

    // 로컬스토리지에서 기존 회고 목록 가져오기
    const existingRetrospectsStr = localStorage.getItem("retrospects");
    const existingRetrospects: RetrospectData[] = existingRetrospectsStr
      ? JSON.parse(existingRetrospectsStr)
      : [];

    // 새 회고의 ID 계산
    const maxId =
      existingRetrospects.length > 0
        ? Math.max(...existingRetrospects.map((r) => r.id))
        : 0;
    const newId = maxId + 1;

    // 새 회고 데이터 생성
    const newRetrospect: RetrospectData = {
      id: newId,
      content: data.content,
      diaryId: diaryId,
      createdAt: new Date().toISOString(),
    };

    // 로컬스토리지에 저장
    const updatedRetrospects = [...existingRetrospects, newRetrospect];
    localStorage.setItem("retrospects", JSON.stringify(updatedRetrospects));

    // 폼 초기화
    reset();

    // 페이지 새로고침
    window.location.reload();
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitDisabled: !isContentFilled,
  };
};
