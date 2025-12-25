"use client";

import {
  ReactNode,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./auth.provider";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { isMemberOnly, paths } from "@/commons/constants/url";

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * 테스트 환경 여부 확인
 */
const isTestEnv = (): boolean => {
  if (typeof window === "undefined") return false;
  return process.env.NEXT_PUBLIC_TEST_ENV === "test";
};

/**
 * Auth Guard 컴포넌트
 * 페이지 접근 권한을 검증하고, 인가되지 않은 경우 적절한 조치를 취함
 */
export const AuthGuard = ({ children }: AuthGuardProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, checkLoginStatus } = useAuth();
  const { openModal, closeAllModals } = useModal();
  
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const modalShownRef = useRef<boolean>(false);
  const modalIdRef = useRef<string | null>(null);

  /**
   * 로그인해주세요 모달 표시
   */
  const showLoginRequiredModal = useCallback(() => {
    // 이미 모달이 열려있으면 다시 열지 않음
    if (modalIdRef.current) {
      return;
    }
    
    const modalId = openModal(
      <Modal
        variant="info"
        actions="single"
        title="로그인이 필요합니다"
        description="이 페이지에 접근하려면 로그인이 필요합니다."
        primaryButtonText="확인"
        onPrimaryClick={() => {
          closeAllModals();
          modalIdRef.current = null;
          router.push(paths.auth.login);
        }}
      />,
      { preventBackdropClose: true }
    );
    
    modalIdRef.current = modalId;
  }, [openModal, closeAllModals, router]);

  /**
   * AuthProvider 초기화 확인 및 권한 검증
   */
  useEffect(() => {
    // 테스트 환경인 경우 즉시 인가
    if (isTestEnv()) {
      setIsInitialized(true);
      setIsAuthorized(true);
      return;
    }

    // 실제 환경에서는 로그인 상태가 설정되면 초기화 완료로 간주
    const checkInit = () => {
      const loginStatus = checkLoginStatus();
      setIsInitialized(true);
      
      // 초기화 후 권한 검증
      const needsAuth = isMemberOnly(pathname);
      
      let authorized = false;
      if (needsAuth) {
        // 회원 전용 페이지인 경우 로그인 필요
        authorized = loginStatus;
      } else {
        // 공개 페이지는 항상 접근 가능
        authorized = true;
      }
      
      setIsAuthorized(authorized);
      
      // 권한이 없고 모달이 아직 표시되지 않은 경우 모달 표시
      if (!authorized && !modalShownRef.current) {
        modalShownRef.current = true;
        showLoginRequiredModal();
      }
    };

    // 약간의 지연을 두어 AuthProvider 초기화 완료 보장
    const timer = setTimeout(checkInit, 0);
    return () => clearTimeout(timer);
  }, [pathname, checkLoginStatus, showLoginRequiredModal]);

  /**
   * 로그인 상태 변경 감지 및 권한 재검증
   */
  useEffect(() => {
    if (!isInitialized) return;

    // 테스트 환경인 경우 항상 인가
    if (isTestEnv()) {
      setIsAuthorized(true);
      return;
    }

    const needsAuth = isMemberOnly(pathname);
    let authorized = false;

    if (needsAuth) {
      // 회원 전용 페이지인 경우 로그인 필요
      authorized = isLoggedIn;
    } else {
      // 공개 페이지는 항상 접근 가능
      authorized = true;
    }

    setIsAuthorized(authorized);

    // 권한이 없고 모달이 아직 표시되지 않은 경우 모달 표시
    if (!authorized && !modalShownRef.current) {
      modalShownRef.current = true;
      showLoginRequiredModal();
    }
  }, [isLoggedIn, pathname, isInitialized, showLoginRequiredModal]);

  /**
   * 경로 변경 시 모달 표시 상태 초기화
   */
  useEffect(() => {
    modalShownRef.current = false;
    modalIdRef.current = null;
  }, [pathname]);

  // 초기화 전 또는 인가되지 않은 경우 빈 화면 표시
  if (!isInitialized || !isAuthorized) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "#ffffff",
        }}
      />
    );
  }

  return <>{children}</>;
};





