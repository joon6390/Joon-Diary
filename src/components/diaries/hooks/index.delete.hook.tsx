"use client";

import { useCallback } from "react";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { useAuthGuard } from "@/commons/providers/auth/auth.guard.hook";
import { Modal } from "@/commons/components/modal";

/**
 * Diaries Delete Hook 반환 타입
 */
export interface DiariesDeleteHookReturn {
  /**
   * 일기 삭제 핸들러
   * 권한 검사를 수행하고, 로그인한 경우에만 삭제 모달을 엽니다.
   * @param id - 삭제할 일기의 ID
   */
  handleDeleteDiary: (id: number) => void;
}

/**
 * Diaries Delete Hook
 * 
 * 일기 삭제 기능을 위한 커스텀 훅
 * 삭제 버튼 클릭시 권한 검사를 수행하고, 로그인한 경우에만 삭제 모달을 표시
 * 
 * @returns {DiariesDeleteHookReturn} 삭제 핸들러 함수
 * - handleDeleteDiary: 일기 삭제 모달을 여는 함수 (권한 검사 포함)
 */
export const useDeleteHook = (): DiariesDeleteHookReturn => {
  const { openModal, closeAllModals } = useModal();
  const { guard } = useAuthGuard();

  /**
   * 일기 삭제 핸들러
   * 권한 검사를 수행하고, 로그인한 경우에만 삭제 모달을 엽니다.
   * @param id - 삭제할 일기의 ID
   */
  const handleDeleteDiary = useCallback((id: number) => {
    // 권한 검사: 로그인하지 않은 경우 모달이 표시되고 false를 반환
    if (!guard()) {
      return;
    }

    // 로그인한 경우 삭제 모달 열기
    openModal(
      <div data-testid="diary-delete-modal">
        <Modal
          variant="info"
          actions="dual"
          title="일기 삭제"
          description="일기를 삭제 하시겠어요?"
          primaryButtonText="삭제"
          secondaryButtonText="취소"
          onPrimaryClick={() => {
            // 로컬스토리지에서 해당 일기 삭제
            try {
              const diariesJson = localStorage.getItem("diaries");
              if (diariesJson) {
                const allDiaries = JSON.parse(diariesJson);
                const updatedDiaries = allDiaries.filter(
                  (diary: { id: number }) => diary.id !== id
                );
                localStorage.setItem("diaries", JSON.stringify(updatedDiaries));
              }
            } catch (error) {
              console.error("일기 삭제 중 오류 발생:", error);
            }

            // 모든 모달 닫기
            closeAllModals();

            // 현재 페이지 새로고침
            window.location.reload();
          }}
          onSecondaryClick={() => {
            // 모든 모달 닫기
            closeAllModals();
          }}
        />
      </div>,
      { preventBackdropClose: true }
    );
  }, [guard, openModal, closeAllModals]);

  return {
    handleDeleteDiary,
  };
};

