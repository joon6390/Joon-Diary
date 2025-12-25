"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/commons/providers/modal/modal.provider";
import { Modal } from "@/commons/components/modal";
import { paths } from "@/commons/constants/url";
import { useRef } from "react";

/**
 * 로그인 폼 스키마
 */
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요.")
    .refine((email) => email.includes("@"), {
      message: "이메일에 @가 포함되어야 합니다.",
    }),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

/**
 * loginUser API 요청 타입
 */
interface LoginUserInput {
  email: string;
  password: string;
}

/**
 * loginUser API 응답 타입
 */
interface LoginUserResponse {
  accessToken: string;
}

/**
 * fetchUserLoggedIn API 응답 타입
 */
interface FetchUserLoggedInResponse {
  _id: string;
  name: string;
}

/**
 * GraphQL 에러 타입
 */
interface GraphQLError {
  message: string;
  extensions?: {
    code?: string;
  };
}

/**
 * GraphQL 응답 타입
 */
interface GraphQLResponse<T> {
  data?: {
    loginUser?: T;
    fetchUserLoggedIn?: T;
  };
  errors?: GraphQLError[];
}

/**
 * loginUser API 호출 함수
 */
const loginUserAPI = async (
  input: LoginUserInput
): Promise<LoginUserResponse> => {
  const query = `
    mutation loginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
        accessToken
      }
    }
  `;

  const response = await fetch(
    "https://main-practice.codebootcamp.co.kr/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          email: input.email,
          password: input.password,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  const result: GraphQLResponse<LoginUserResponse> = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(
      result.errors[0].message || "로그인에 실패했습니다."
    );
  }

  if (!result.data?.loginUser?.accessToken) {
    throw new Error("로그인 응답이 올바르지 않습니다.");
  }

  return result.data.loginUser;
};

/**
 * fetchUserLoggedIn API 호출 함수
 */
const fetchUserLoggedInAPI = async (
  accessToken: string
): Promise<FetchUserLoggedInResponse> => {
  const query = `
    query fetchUserLoggedIn {
      fetchUserLoggedIn {
        _id
        name
      }
    }
  `;

  const response = await fetch(
    "https://main-practice.codebootcamp.co.kr/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  const result: GraphQLResponse<FetchUserLoggedInResponse> =
    await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(
      result.errors[0].message || "사용자 정보 조회에 실패했습니다."
    );
  }

  if (!result.data?.fetchUserLoggedIn?._id || !result.data?.fetchUserLoggedIn?.name) {
    throw new Error("사용자 정보 응답이 올바르지 않습니다.");
  }

  return result.data.fetchUserLoggedIn;
};

/**
 * 로그인 폼 Hook 반환 타입
 */
export interface LoginFormHookReturn {
  control: ReturnType<typeof useForm<LoginFormData>>["control"];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: ReturnType<typeof useForm<LoginFormData>>["formState"]["errors"];
  isSubmitDisabled: boolean;
}

/**
 * 로그인 폼 Hook
 *
 * react-hook-form과 zod를 사용한 로그인 폼 관리
 * GraphQL API를 통해 로그인 요청을 보내고 결과에 따라 모달을 표시
 *
 * @returns {LoginFormHookReturn} 폼 관리 함수 및 상태
 * - control: 폼 필드 제어 객체
 * - handleSubmit: 폼 제출 핸들러
 * - errors: 폼 검증 에러
 * - isSubmitDisabled: 제출 버튼 비활성화 여부
 */
export const useFormHook = (): LoginFormHookReturn => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();
  const hasShownSuccessModal = useRef(false);
  const hasShownErrorModal = useRef(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
  });

  // 모든 필드 값 감시
  const watchedFields = watch();

  // 모든 필드가 입력되고 유효한지 확인
  const isAllFieldsFilled =
    !!watchedFields.email &&
    !!watchedFields.password &&
    isValid;

  // loginUser mutation
  const loginUserMutation = useMutation({
    mutationFn: loginUserAPI,
    onSuccess: async (data) => {
      // 모달이 이미 표시된 경우 중복 방지
      if (hasShownSuccessModal.current) return;
      
      // accessToken을 로컬스토리지에 저장
      localStorage.setItem("accessToken", data.accessToken);
      
      // 커스텀 이벤트 발생 (동일 탭에서 변경 감지)
      window.dispatchEvent(new Event("localStorageChange"));

      // fetchUserLoggedIn API 호출
      try {
        const userData = await fetchUserLoggedInAPI(data.accessToken);
        
        // user 정보를 로컬스토리지에 저장
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: userData._id,
            name: userData.name,
          })
        );
        
        // 커스텀 이벤트 발생 (동일 탭에서 변경 감지)
        window.dispatchEvent(new Event("localStorageChange"));

        // 모달이 이미 표시된 경우 중복 방지
        if (hasShownSuccessModal.current) return;
        hasShownSuccessModal.current = true;

        // 로그인완료모달 열기
        openModal(
          <div data-testid="login-success-modal">
            <Modal
              variant="info"
              actions="single"
              theme="light"
              title="로그인 완료"
              description="로그인이 성공적으로 완료되었습니다."
              primaryButtonText="확인"
              onPrimaryClick={() => {
                // 모든 모달 닫기
                closeAllModals();
                // 일기목록 페이지로 이동
                router.push(paths.diaries.list);
              }}
            />
          </div>
        );
      } catch (error) {
        // fetchUserLoggedIn 실패시 에러 모달 표시
        if (hasShownErrorModal.current) return;
        hasShownErrorModal.current = true;

        openModal(
          <div data-testid="login-error-modal">
            <Modal
              variant="danger"
              actions="single"
              theme="light"
              title="로그인 실패"
              description={
                error instanceof Error
                  ? error.message
                  : "사용자 정보 조회에 실패했습니다."
              }
              primaryButtonText="확인"
              onPrimaryClick={() => {
                // 모든 모달 닫기
                closeAllModals();
                // 에러 모달 표시 상태 리셋
                hasShownErrorModal.current = false;
              }}
            />
          </div>
        );
      }
    },
    onError: (error: Error) => {
      // 모달이 이미 표시된 경우 중복 방지
      if (hasShownErrorModal.current) return;
      hasShownErrorModal.current = true;

      // 로그인실패모달 열기
      openModal(
        <div data-testid="login-error-modal">
          <Modal
            variant="danger"
            actions="single"
            theme="light"
            title="로그인 실패"
            description={error.message || "로그인에 실패했습니다."}
            primaryButtonText="확인"
            onPrimaryClick={() => {
              // 모든 모달 닫기
              closeAllModals();
              // 에러 모달 표시 상태 리셋
              hasShownErrorModal.current = false;
            }}
          />
        </div>
      );
    },
  });

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = (data: LoginFormData) => {
    // 모달 표시 상태 리셋
    hasShownSuccessModal.current = false;
    hasShownErrorModal.current = false;

    // API 호출
    loginUserMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitDisabled: !isAllFieldsFilled,
  };
};

