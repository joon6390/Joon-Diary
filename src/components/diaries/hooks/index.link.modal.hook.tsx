"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
import DiariesNew from "@/components/diaries-new";

/**
 * 일기쓰기 모달 연동 Hook
 * 
 * 기능:
 * - 일기쓰기 버튼 클릭시 모달을 열어서 일기 작성 폼을 표시
 * - 기존에 설정된 modal provider 활용
 */
export const useLinkModal = () => {
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

