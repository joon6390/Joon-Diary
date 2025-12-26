"use client";

import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";

/**
 * 일기쓰기 모달 닫기 Hook 반환 타입
 */
export interface DiariesNewLinkModalCloseReturn {
  handleClose: () => void;
}

/**
 * 일기쓰기 모달 닫기 Hook
 *
 * 일기쓰기폼모달의 닫기 버튼 클릭 시 등록취소모달을 열고,
 * 등록취소모달의 버튼들을 통해 모달을 제어하는 커스텀 훅
 *
 * @returns {DiariesNewLinkModalCloseReturn} 모달 제어 함수
 * - handleClose: 닫기 버튼 클릭 시 등록취소모달을 여는 함수
 */
export const useLinkModalClose = (): DiariesNewLinkModalCloseReturn => {
  const { openModal, closeModal, closeAllModals } = useModal();

  /**
   * 닫기 버튼 클릭 핸들러
   * 등록취소모달을 일기쓰기폼모달 위에 2중 모달로 열기
   */
  const handleClose = () => {
    openModal(
      <div data-testid="cancel-modal">
        <Modal
          variant="info"
          actions="dual"
          title="일기 등록 취소"
          description="일기 등록을 취소 하시겠어요?"
          primaryButtonText="등록 취소"
          secondaryButtonText="계속 작성"
          onPrimaryClick={() => {
            // 등록취소 버튼: 두 모달 모두 닫기
            closeAllModals();
          }}
          onSecondaryClick={() => {
            // 계속작성 버튼: 등록취소모달만 닫기
            closeModal();
          }}
        />
      </div>
    );
  };

  return {
    handleClose,
  };
};

