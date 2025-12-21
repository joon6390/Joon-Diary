"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
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
 * 일기쓰기 버튼 클릭시 모달을 열어서 일기 작성 폼을 표시
 * 
 * @returns {DiariesLinkModalReturn} 모달 제어 함수들
 * - handleWriteDiary: 일기쓰기 모달을 여는 함수
 * - closeModal: 모달을 닫는 함수
 */
export const useLinkModal = (): DiariesLinkModalReturn => {
  const { openModal, closeModal } = useModal();

  /**
   * 일기쓰기 모달 열기
   */
  const handleWriteDiary = () => {
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

