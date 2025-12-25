"use client";

import { useAuth } from "@/commons/providers/auth/auth.provider";

/**
 * Layout Auth Hook 반환 타입
 */
export interface LayoutAuthHookReturn {
  // 로그인 상태
  isLoggedIn: boolean;
  // 유저 이름
  userName: string | null;
  // 로그인 함수 (로그인 페이지로 이동)
  handleLogin: () => void;
  // 로그아웃 함수
  handleLogout: () => void;
}

/**
 * Layout Auth Hook
 * 
 * 인증 프로바이더를 활용하여 로그인 상태에 따른 UI 분기 로직을 제공
 * 
 * @returns {LayoutAuthHookReturn} 인증 관련 상태 및 함수
 * - isLoggedIn: 로그인 여부
 * - userName: 유저 이름 (로그인 상태일 때만 값 존재)
 * - handleLogin: 로그인 페이지로 이동하는 함수
 * - handleLogout: 로그아웃 처리하는 함수
 */
export const useLayoutAuth = (): LayoutAuthHookReturn => {
  const { isLoggedIn, user, login, logout } = useAuth();

  /**
   * 로그인 처리 함수
   * 인증 프로바이더의 login 함수 호출
   */
  const handleLogin = () => {
    login();
  };

  /**
   * 로그아웃 처리 함수
   * 인증 프로바이더의 logout 함수 호출
   */
  const handleLogout = () => {
    logout();
  };

  return {
    isLoggedIn,
    userName: user?.name || null,
    handleLogin,
    handleLogout,
  };
};

