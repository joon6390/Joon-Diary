import { test, expect } from "@playwright/test";

/**
 * Auth Signup Form Hook 테스트
 * 
 * 테스트 시나리오:
 * 1. 모든 인풋이 입력되면 회원가입 버튼 활성화
 * 2. 회원가입 버튼 클릭시 createUser API 호출
 * 3. 회원가입 성공시 가입완료모달 노출 및 로그인 페이지 이동
 * 4. 회원가입 실패시 가입실패모달 노출
 * 
 * 테스트 대상:
 * - useFormHook Hook
 * - react-hook-form + zod 검증
 * - GraphQL API 연동 (@tanstack/react-query)
 * - Modal Provider 연동
 */

test.describe("회원가입 폼 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 회원가입 페이지로 이동
    await page.goto("/auth/signup");
    
    // 페이지 로드 대기 (data-testid로 식별)
    await expect(page.locator('[data-testid="signup-container"]')).toBeVisible();
  });

  test.describe("폼 검증 - 회원가입 버튼 활성화 조건", () => {
    test("초기 상태에서 회원가입 버튼은 비활성화되어야 한다", async ({ page }) => {
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("이메일만 입력한 경우 회원가입 버튼은 비활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("이메일과 비밀번호만 입력한 경우 회원가입 버튼은 비활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("모든 필드를 올바르게 입력하면 회원가입 버튼이 활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeEnabled();
    });
  });

  test.describe("폼 검증 - 이메일 형식", () => {
    test("이메일에 @가 없으면 에러 메시지를 표시해야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "invalid-email");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      // 버튼이 여전히 비활성화 상태
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("올바른 이메일 형식이면 에러가 없어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "valid@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeEnabled();
    });
  });

  test.describe("폼 검증 - 비밀번호", () => {
    test("비밀번호가 8자 미만이면 버튼이 비활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      await page.fill('[data-testid="signup-password-input"]', "pass1");
      await page.fill('[data-testid="signup-password-confirm-input"]', "pass1");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("비밀번호에 영문이 없으면 버튼이 비활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      await page.fill('[data-testid="signup-password-input"]', "12345678");
      await page.fill('[data-testid="signup-password-confirm-input"]', "12345678");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("비밀번호에 숫자가 없으면 버튼이 비활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("비밀번호가 영문+숫자 8자 이상이면 버튼이 활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeEnabled();
    });
  });

  test.describe("폼 검증 - 비밀번호 확인", () => {
    test("비밀번호와 비밀번호 확인이 다르면 버튼이 비활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "different123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("비밀번호와 비밀번호 확인이 같으면 버튼이 활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeEnabled();
    });
  });

  test.describe("폼 검증 - 이름", () => {
    test("이름이 비어있으면 버튼이 비활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("이름이 1글자 이상이면 버튼이 활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="signup-email-input"]', "test@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await expect(submitButton).toBeEnabled();
    });
  });

  test.describe("회원가입 API - 성공 시나리오", () => {
    test("회원가입 성공시 _id가 반환되고 가입완료모달이 표시되어야 한다", async ({ page }) => {
      // timestamp를 포함한 유니크한 이메일 생성
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;
      
      // 폼 입력
      await page.fill('[data-testid="signup-email-input"]', email);
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      // 회원가입 버튼 클릭
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await submitButton.click();
      
      // 가입완료모달이 표시될 때까지 대기 (최대 5초 - 실제 API 호출)
      const successModal = page.locator('[data-testid="signup-success-modal"]');
      await expect(successModal).toBeVisible({ timeout: 5000 });
      
      // 모달 내용 확인
      await expect(successModal).toContainText("회원가입 완료");
    });

    test("가입완료모달의 확인 버튼 클릭시 로그인 페이지로 이동해야 한다", async ({ page }) => {
      // timestamp를 포함한 유니크한 이메일 생성
      const timestamp = Date.now();
      const email = `test${timestamp}@example.com`;
      
      // 폼 입력 및 제출
      await page.fill('[data-testid="signup-email-input"]', email);
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await submitButton.click();
      
      // 가입완료모달 대기 (최대 5초 - 실제 API 호출)
      const successModal = page.locator('[data-testid="signup-success-modal"]');
      await expect(successModal).toBeVisible({ timeout: 5000 });
      
      // 확인 버튼 클릭
      const confirmButton = successModal.locator('button').filter({ hasText: '확인' });
      await confirmButton.click();
      
      // 로그인 페이지로 이동 확인
      await expect(page).toHaveURL("/auth/login");
      
      // 모든 모달이 닫혔는지 확인
      await expect(successModal).not.toBeVisible();
    });
  });

  test.describe("회원가입 API - 실패 시나리오", () => {
    test("중복된 이메일로 회원가입시 가입실패모달이 표시되어야 한다", async ({ page }) => {
      // API 모킹 - 중복 이메일 에러 응답
      await page.route("**/graphql", async (route) => {
        const postData = route.request().postData();
        if (postData && postData.includes("createUser")) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              errors: [{
                message: "이미 존재하는 이메일입니다.",
                extensions: {
                  code: "DUPLICATE_EMAIL"
                }
              }]
            }),
          });
        } else {
          await route.continue();
        }
      });
      
      // 폼 입력
      await page.fill('[data-testid="signup-email-input"]', "duplicate@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      // 회원가입 버튼 클릭
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await submitButton.click();
      
      // 가입실패모달이 표시될 때까지 대기
      const errorModal = page.locator('[data-testid="signup-error-modal"]');
      await expect(errorModal).toBeVisible({ timeout: 2000 });
      
      // 모달 내용 확인
      await expect(errorModal).toContainText("회원가입 실패");
    });

    test("가입실패모달의 확인 버튼 클릭시 모달이 닫혀야 한다", async ({ page }) => {
      // API 모킹 - 에러 응답
      await page.route("**/graphql", async (route) => {
        const postData = route.request().postData();
        if (postData && postData.includes("createUser")) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              errors: [{
                message: "회원가입에 실패했습니다."
              }]
            }),
          });
        } else {
          await route.continue();
        }
      });
      
      // 폼 입력 및 제출
      await page.fill('[data-testid="signup-email-input"]', "error@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await submitButton.click();
      
      // 가입실패모달 대기
      const errorModal = page.locator('[data-testid="signup-error-modal"]');
      await expect(errorModal).toBeVisible({ timeout: 2000 });
      
      // 확인 버튼 클릭
      const confirmButton = errorModal.locator('button').filter({ hasText: '확인' });
      await confirmButton.click();
      
      // 모달이 닫혔는지 확인
      await expect(errorModal).not.toBeVisible();
      
      // 페이지는 여전히 회원가입 페이지에 있어야 함
      await expect(page).toHaveURL("/auth/signup");
    });

    test("네트워크 에러 발생시 가입실패모달이 표시되어야 한다", async ({ page }) => {
      // API 모킹 - 네트워크 에러
      await page.route("**/graphql", async (route) => {
        const postData = route.request().postData();
        if (postData && postData.includes("createUser")) {
          await route.abort("failed");
        } else {
          await route.continue();
        }
      });
      
      // 폼 입력 및 제출
      await page.fill('[data-testid="signup-email-input"]', "network@example.com");
      await page.fill('[data-testid="signup-password-input"]', "password123");
      await page.fill('[data-testid="signup-password-confirm-input"]', "password123");
      await page.fill('[data-testid="signup-name-input"]', "홍길동");
      
      const submitButton = page.locator('[data-testid="signup-submit-button"]');
      await submitButton.click();
      
      // 가입실패모달이 표시될 때까지 대기
      const errorModal = page.locator('[data-testid="signup-error-modal"]');
      await expect(errorModal).toBeVisible({ timeout: 2000 });
    });
  });

  test.describe("로그인 페이지 링크", () => {
    test("로그인 링크 클릭시 로그인 페이지로 이동해야 한다", async ({ page }) => {
      const loginLink = page.locator('[data-testid="login-link"]');
      await loginLink.click();
      
      await expect(page).toHaveURL("/auth/login");
    });
  });
});
