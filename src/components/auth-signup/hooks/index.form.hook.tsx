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
 * 회원가입 폼 스키마
 */
const signupFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .email("올바른 이메일 형식이 아닙니다.")
      .refine((email) => email.includes("@"), {
        message: "이메일에 @가 포함되어야 합니다.",
      }),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(/[a-zA-Z]/, "비밀번호에 영문이 포함되어야 합니다.")
      .regex(/[0-9]/, "비밀번호에 숫자가 포함되어야 합니다."),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignupFormData = z.infer<typeof signupFormSchema>;

/**
 * createUser API 요청 타입
 */
interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

/**
 * createUser API 응답 타입
 */
interface CreateUserResponse {
  _id: string;
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
    createUser?: T;
  };
  errors?: GraphQLError[];
}

/**
 * GraphQL API 호출 함수
 */
const createUserAPI = async (
  input: CreateUserInput
): Promise<CreateUserResponse> => {
  const query = `
    mutation createUser($createUserInput: CreateUserInput!) {
      createUser(createUserInput: $createUserInput) {
        _id
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
          createUserInput: input,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("네트워크 오류가 발생했습니다.");
  }

  const result: GraphQLResponse<CreateUserResponse> = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message || "회원가입에 실패했습니다.");
  }

  if (!result.data?.createUser?._id) {
    throw new Error("회원가입 응답이 올바르지 않습니다.");
  }

  return result.data.createUser;
};

/**
 * 회원가입 폼 Hook 반환 타입
 */
export interface SignupFormHookReturn {
  control: ReturnType<typeof useForm<SignupFormData>>["control"];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: ReturnType<typeof useForm<SignupFormData>>["formState"]["errors"];
  isSubmitDisabled: boolean;
}

/**
 * 회원가입 폼 Hook
 *
 * react-hook-form과 zod를 사용한 회원가입 폼 관리
 * GraphQL API를 통해 회원가입 요청을 보내고 결과에 따라 모달을 표시
 *
 * @returns {SignupFormHookReturn} 폼 관리 함수 및 상태
 * - register: 폼 필드 등록 함수
 * - handleSubmit: 폼 제출 핸들러
 * - errors: 폼 검증 에러
 * - isSubmitDisabled: 제출 버튼 비활성화 여부
 */
export const useFormHook = (): SignupFormHookReturn => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();
  const hasShownSuccessModal = useRef(false);
  const hasShownErrorModal = useRef(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange",
  });

  // 모든 필드 값 감시
  const watchedFields = watch();
  
  // 모든 필드가 입력되고 유효한지 확인
  const isAllFieldsFilled = 
    !!watchedFields.email &&
    !!watchedFields.password &&
    !!watchedFields.passwordConfirm &&
    !!watchedFields.name &&
    isValid;

  // createUser mutation
  const createUserMutation = useMutation({
    mutationFn: createUserAPI,
    onSuccess: () => {
      // 모달이 이미 표시된 경우 중복 방지
      if (hasShownSuccessModal.current) return;
      hasShownSuccessModal.current = true;

      // 가입완료모달 열기
      openModal(
        <div data-testid="signup-success-modal">
          <Modal
            variant="info"
            actions="single"
            theme="light"
            title="회원가입 완료"
            description="회원가입이 성공적으로 완료되었습니다."
            primaryButtonText="확인"
            onPrimaryClick={() => {
              // 모든 모달 닫기
              closeAllModals();
              // 로그인 페이지로 이동
              router.push(paths.auth.login);
            }}
          />
        </div>
      );
    },
    onError: (error: Error) => {
      // 모달이 이미 표시된 경우 중복 방지
      if (hasShownErrorModal.current) return;
      hasShownErrorModal.current = true;

      // 가입실패모달 열기
      openModal(
        <div data-testid="signup-error-modal">
          <Modal
            variant="danger"
            actions="single"
            theme="light"
            title="회원가입 실패"
            description={error.message || "회원가입에 실패했습니다."}
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
  const onSubmit = (data: SignupFormData) => {
    // 모달 표시 상태 리셋
    hasShownSuccessModal.current = false;
    hasShownErrorModal.current = false;

    // API 호출
    createUserMutation.mutate({
      email: data.email,
      password: data.password,
      name: data.name,
    });
  };

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitDisabled: !isAllFieldsFilled,
  };
};
