"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";
import { DiaryData } from "./index.binding.hook";
import { EmotionType } from "@/commons/constants/enum";

/**
 * 일기 수정 폼 스키마
 */
const diaryUpdateFormSchema = z.object({
  emotion: z.nativeEnum(EmotionType),
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
});

type DiaryUpdateFormData = z.infer<typeof diaryUpdateFormSchema>;

/**
 * 일기 수정 Hook 반환 타입
 */
export interface DiaryUpdateHookReturn {
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  control: ReturnType<typeof useForm<DiaryUpdateFormData>>["control"];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleCancel: () => void;
  errors: ReturnType<
    typeof useForm<DiaryUpdateFormData>
  >["formState"]["errors"];
  isSubmitDisabled: boolean;
}

/**
 * 일기 수정 Hook
 *
 * react-hook-form과 zod를 사용한 일기 수정 폼 관리
 * 로컬스토리지의 일기 데이터를 업데이트하고 수정 완료시 페이지를 새로고침
 *
 * @param diary - 현재 일기 데이터
 * @returns {DiaryUpdateHookReturn} 수정 폼 관리 함수 및 상태
 * - isEditMode: 수정 모드 여부
 * - setIsEditMode: 수정 모드 설정 함수
 * - control: 폼 필드 제어 객체
 * - handleSubmit: 폼 제출 핸들러
 * - handleCancel: 취소 핸들러
 * - errors: 폼 검증 에러
 * - isSubmitDisabled: 제출 버튼 비활성화 여부
 */
export const useUpdateHook = (
  diary: DiaryData | null
): DiaryUpdateHookReturn => {
  const params = useParams();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<DiaryUpdateFormData>({
    resolver: zodResolver(diaryUpdateFormSchema),
    mode: "onChange",
    defaultValues: diary
      ? {
          emotion: diary.emotion,
          title: diary.title,
          content: diary.content,
        }
      : {
          emotion: EmotionType.Happy,
          title: "",
          content: "",
        },
  });

  // diary가 변경되면 폼 초기값 업데이트
  useEffect(() => {
    if (diary && isEditMode) {
      reset({
        emotion: diary.emotion,
        title: diary.title,
        content: diary.content,
      });
    }
  }, [diary, isEditMode, reset]);

  // 모든 필드 값 감시
  const watchedFields = watch();
  const isAllFieldsFilled =
    watchedFields.emotion &&
    watchedFields.title &&
    watchedFields.content &&
    isValid;

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = (data: DiaryUpdateFormData) => {
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

    // 로컬스토리지에서 기존 일기 목록 가져오기
    const existingDiariesStr = localStorage.getItem("diaries");
    const existingDiaries: DiaryData[] = existingDiariesStr
      ? JSON.parse(existingDiariesStr)
      : [];

    // 일기 찾기 및 업데이트
    const updatedDiaries = existingDiaries.map((d) => {
      if (d.id === diaryId) {
        return {
          ...d,
          title: data.title,
          content: data.content,
          emotion: data.emotion,
        };
      }
      return d;
    });

    // 로컬스토리지에 저장
    localStorage.setItem("diaries", JSON.stringify(updatedDiaries));

    // 수정 모드 종료
    setIsEditMode(false);

    // 페이지 새로고침
    window.location.reload();
  };

  /**
   * 취소 핸들러
   */
  const handleCancel = () => {
    // 폼 초기값으로 리셋
    if (diary) {
      reset({
        emotion: diary.emotion,
        title: diary.title,
        content: diary.content,
      });
    }
    // 수정 모드 종료
    setIsEditMode(false);
  };

  return {
    isEditMode,
    setIsEditMode,
    control,
    handleSubmit: handleSubmit(onSubmit),
    handleCancel,
    errors,
    isSubmitDisabled: !isAllFieldsFilled,
  };
};
