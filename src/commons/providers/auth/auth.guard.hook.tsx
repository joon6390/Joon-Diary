"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth.provider";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { paths } from "@/commons/constants/url";

/**
 * 테스트 환경 여부 확인
 */
const isTestEnv = (): boolean => {
  if (typeof window === "undefined") return false;
  return process.env.NEXT_PUBLIC_TEST_ENV === "test";
};

/**
 * 로그인 검사 패스 여부 확인
 * - 실제환경: 항상 false (로그인검사 패스하지 않음)
 * - 테스트환경: window.__TEST_BYPASS__가 true가 아니면 true (로그인검사 패스)
 */
const shouldBypassLoginCheck = (): boolean => {
  if (typeof window === "undefined") return false;

  // 실제환경: 항상 비로그인 유저를 기본으로 하여, 로그인검사를 패스하지 않음
  if (!isTestEnv()) {
    return false;
  }

  // 테스트환경: window.__TEST_BYPASS__가 true가 아니면 로그인검사를 패스
  // (비회원 가드테스트가 필요한 경우에만 window.__TEST_BYPASS__ = false로 설정)
  return !(window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__;
};

/**
 * Auth Guard Hook 반환 타입
 */
export interface AuthGuardHookReturn {
  /**
   * 권한 검증 함수
   * 로그인하지 않은 경우 모달을 표시하고 false를 반환
   * 로그인한 경우 true를 반환
   */
  guard: () => boolean;
}

/**
 * Auth Guard Hook
 * 권한 여부를 검증하는 GUARD 기능을 제공
 *
 * @returns {AuthGuardHookReturn} guard 함수
 */
export const useAuthGuard = (): AuthGuardHookReturn => {
  const router = useRouter();
  const { checkLoginStatus } = useAuth();
  const { openModal, closeAllModals } = useModal();

  // 모달이 이미 표시되었는지 추적 (한 번만 보여야 함)
  const modalShownRef = useRef<boolean>(false);
  const modalIdRef = useRef<string | null>(null);

  /**
   * 로그인하시겠습니까 모달 표시
   */
  const showLoginRequiredModal = useCallback(() => {
    // 이미 모달이 열려있으면 다시 열지 않음
    if (modalIdRef.current) {
      return;
    }

    const modalId = openModal(
      <div data-testid="login-required-modal">
        <Modal
          variant="info"
          actions="dual"
          title="로그인하시겠습니까?"
          description="회원 전용 기능입니다. 로그인이 필요합니다."
          primaryButtonText="로그인"
          secondaryButtonText="취소"
          onPrimaryClick={() => {
            // 모든 모달 닫기
            closeAllModals();
            modalIdRef.current = null;
            modalShownRef.current = false;
            // 로그인 페이지로 이동
            router.push(paths.auth.login);
          }}
          onSecondaryClick={() => {
            // 모든 모달 닫기
            closeAllModals();
            modalIdRef.current = null;
            modalShownRef.current = false;
          }}
        />
      </div>,
      { preventBackdropClose: true }
    );

    modalIdRef.current = modalId;
  }, [openModal, closeAllModals, router]);

  /**
   * 권한 검증 함수
   * 함수 요청 시 인가를 검증함
   */
  const guard = useCallback((): boolean => {
    // 테스트 환경에서 로그인검사를 패스해야 하는 경우
    if (shouldBypassLoginCheck()) {
      return true;
    }

    // 로그인 상태 확인
    const isLoggedIn = checkLoginStatus();

    // 로그인하지 않은 경우
    if (!isLoggedIn) {
      // 모달이 아직 표시되지 않은 경우에만 표시
      if (!modalShownRef.current) {
        modalShownRef.current = true;
        showLoginRequiredModal();
      }
      return false;
    }

    // 로그인한 경우
    return true;
  }, [checkLoginStatus, showLoginRequiredModal]);

  return {
    guard,
  };
};
