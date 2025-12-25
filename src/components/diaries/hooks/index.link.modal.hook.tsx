"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
import { useAuthGuard } from "@/commons/providers/auth/auth.guard.hook";
import DiariesNew from "@/components/diaries-new";

/**
 * Diaries Link Modal Hook 반환 타입
 */
export interface DiariesLinkModalReturn {
  handleWriteDiary: () => void;
  closeModal: () => void;
}

/**
 * Diaries Link Modal Hook
 * 
 * 일기쓰기 모달 연동을 위한 커스텀 훅
 * 일기쓰기 버튼 클릭시 권한 검사를 수행하고, 로그인한 경우에만 모달을 열어서 일기 작성 폼을 표시
 * 
 * @returns {DiariesLinkModalReturn} 모달 제어 함수들
 * - handleWriteDiary: 일기쓰기 모달을 여는 함수 (권한 검사 포함)
 * - closeModal: 모달을 닫는 함수
 */
export const useLinkModal = (): DiariesLinkModalReturn => {
  const { openModal, closeModal } = useModal();
  const { guard } = useAuthGuard();

  /**
   * 일기쓰기 모달 열기
   * 권한 검사를 수행하고, 로그인한 경우에만 모달을 엽니다.
   */
  const handleWriteDiary = () => {
    // 권한 검사: 로그인하지 않은 경우 모달이 표시되고 false를 반환
    if (!guard()) {
      return;
    }

    // 로그인한 경우 일기쓰기 모달 열기
    openModal(
      <div data-testid="diary-modal">
        <DiariesNew />
      </div>
    );
  };

  return {
    handleWriteDiary,
    closeModal,
  };
};

