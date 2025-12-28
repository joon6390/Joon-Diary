"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { EmotionType } from "@/commons/constants/enum";
import { paths } from "@/commons/constants/url";
import { useAuth } from "@/commons/providers/auth/auth.provider";
import { useCreateDiary } from "@/commons/hooks/use-diaries";

/**
 * 일기 폼 스키마
 */
const diaryFormSchema = z.object({
  emotion: z.nativeEnum(EmotionType),
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
});

type DiaryFormData = z.infer<typeof diaryFormSchema>;

/**
 * 일기 작성 폼 Hook 반환 타입
 */
export interface DiariesNewFormHookReturn {
  register: ReturnType<typeof useForm<DiaryFormData>>["register"];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: ReturnType<typeof useForm<DiaryFormData>>["formState"]["errors"];
  isSubmitDisabled: boolean;
}

/**
 * 일기 작성 폼 Hook
 *
 * react-hook-form과 zod를 사용한 일기 작성 폼 관리
 * 로컬스토리지에 일기를 저장하고 등록 완료시 모달을 표시
 *
 * @returns {DiariesNewFormHookReturn} 폼 관리 함수 및 상태
 * - register: 폼 필드 등록 함수
 * - handleSubmit: 폼 제출 핸들러
 * - errors: 폼 검증 에러
 * - isSubmitDisabled: 제출 버튼 비활성화 여부
 */
export const useFormHook = (): DiariesNewFormHookReturn => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();
  const { getUser } = useAuth();
  const createDiary = useCreateDiary();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<DiaryFormData>({
    resolver: zodResolver(diaryFormSchema),
    mode: "onChange",
  });

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
  const onSubmit = async (data: DiaryFormData) => {
    // 현재 로그인한 사용자 정보 가져오기
    const currentUser = getUser();

    try {
      // API를 통해 일기 생성
      const newDiary = await createDiary.mutateAsync({
        title: data.title,
        content: data.content,
        emotion: data.emotion,
        userId: currentUser?._id,
        userName: currentUser?.name,
      });

      // 등록완료모달 열기
      openModal(
        <div data-testid="success-modal">
          <Modal
            variant="info"
            actions="single"
            theme="light"
            title="일기 등록 완료"
            description="일기가 성공적으로 등록되었습니다."
            primaryButtonText="확인"
            onPrimaryClick={() => {
              // 모든 모달 닫기
              closeAllModals();
              // 상세페이지로 이동
              router.push(paths.diaries.detail(newDiary.id));
            }}
          />
        </div>
      );
    } catch (error) {
      console.error("일기 생성 중 오류:", error);
      // 에러 모달 표시
      openModal(
        <div data-testid="error-modal">
          <Modal
            variant="info"
            actions="single"
            theme="light"
            title="일기 등록 실패"
            description="일기 등록에 실패했습니다. 다시 시도해주세요."
            primaryButtonText="확인"
            onPrimaryClick={() => {
              closeAllModals();
            }}
          />
        </div>
      );
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitDisabled: !isAllFieldsFilled,
  };
};
