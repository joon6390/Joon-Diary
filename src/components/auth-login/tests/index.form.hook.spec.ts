import { test, expect } from "@playwright/test";

/**
 * Auth Login Form Hook 테스트
 * 
 * 테스트 시나리오:
 * 1. 모든 인풋이 입력되면 로그인 버튼 활성화
 * 2. 로그인 버튼 클릭시 loginUser API 호출
 * 3. 로그인 성공시 fetchUserLoggedIn API 호출
 * 4. 로컬스토리지에 accessToken과 user 정보 저장
 * 5. 로그인완료모달 노출 및 일기목록 페이지 이동
 * 6. 로그인 실패시 로그인실패모달 노출
 * 
 * 테스트 대상:
 * - useFormHook Hook
 * - react-hook-form + zod 검증
 * - GraphQL API 연동 (@tanstack/react-query)
 * - Modal Provider 연동
 * - 로컬스토리지 저장
 */

test.describe("로그인 폼 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto("/auth/login");
    
    // 페이지 로드 대기 (data-testid로 식별)
    await expect(page.locator('[data-testid="login-container"]')).toBeVisible();
  });

  test.describe("폼 검증 - 로그인 버튼 활성화 조건", () => {
    test("초기 상태에서 로그인 버튼은 비활성화되어야 한다", async ({ page }) => {
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("이메일만 입력한 경우 로그인 버튼은 비활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="login-email-input"]', "a@c.com");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("이메일과 비밀번호를 모두 입력하면 로그인 버튼이 활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="login-email-input"]', "a@c.com");
      await page.fill('[data-testid="login-password-input"]', "1234qwer");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toBeEnabled();
    });
  });

  test.describe("폼 검증 - 이메일 형식", () => {
    test("이메일에 @가 없으면 버튼이 비활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="login-email-input"]', "invalid-email");
      await page.fill('[data-testid="login-password-input"]', "1234qwer");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("이메일에 @가 포함되면 버튼이 활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="login-email-input"]', "a@c.com");
      await page.fill('[data-testid="login-password-input"]', "1234qwer");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toBeEnabled();
    });
  });

  test.describe("폼 검증 - 비밀번호", () => {
    test("비밀번호가 비어있으면 버튼이 비활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="login-email-input"]', "a@c.com");
      await page.fill('[data-testid="login-password-input"]', "");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toBeDisabled();
    });

    test("비밀번호가 1글자 이상이면 버튼이 활성화되어야 한다", async ({ page }) => {
      await page.fill('[data-testid="login-email-input"]', "a@c.com");
      await page.fill('[data-testid="login-password-input"]', "1");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toBeEnabled();
    });
  });

  test.describe("로그인 API - 성공 시나리오", () => {
    test("로그인 성공시 accessToken이 반환되고 로그인완료모달이 표시되어야 한다", async ({ page }) => {
      // 폼 입력
      await page.fill('[data-testid="login-email-input"]', "a@c.com");
      await page.fill('[data-testid="login-password-input"]', "1234qwer");
      
      // 로그인 버튼 클릭
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await submitButton.click();
      
      // 로그인완료모달이 표시될 때까지 대기 (최대 5초 - 실제 API 호출)
      const successModal = page.locator('[data-testid="login-success-modal"]');
      await expect(successModal).toBeVisible({ timeout: 5000 });
      
      // 모달 내용 확인
      await expect(successModal).toContainText("로그인 완료");
    });

    test("로그인 성공시 accessToken이 로컬스토리지에 저장되어야 한다", async ({ page }) => {
      // 폼 입력 및 제출
      await page.fill('[data-testid="login-email-input"]', "a@c.com");
      await page.fill('[data-testid="login-password-input"]', "1234qwer");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await submitButton.click();
      
      // 로그인완료모달 대기
      const successModal = page.locator('[data-testid="login-success-modal"]');
      await expect(successModal).toBeVisible({ timeout: 5000 });
      
      // 로컬스토리지에서 accessToken 확인
      const accessToken = await page.evaluate(() => localStorage.getItem("accessToken"));
      expect(accessToken).toBeTruthy();
      expect(accessToken).not.toBe("");
    });

    test("로그인 성공시 fetchUserLoggedIn API가 호출되고 user 정보가 로컬스토리지에 저장되어야 한다", async ({ page }) => {
      // 폼 입력 및 제출
      await page.fill('[data-testid="login-email-input"]', "a@c.com");
      await page.fill('[data-testid="login-password-input"]', "1234qwer");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await submitButton.click();
      
      // 로그인완료모달 대기
      const successModal = page.locator('[data-testid="login-success-modal"]');
      await expect(successModal).toBeVisible({ timeout: 5000 });
      
      // 로컬스토리지에서 user 정보 확인
      const userStr = await page.evaluate(() => localStorage.getItem("user"));
      expect(userStr).toBeTruthy();
      
      const user = JSON.parse(userStr || "{}");
      expect(user._id).toBeTruthy();
      expect(user.name).toBeTruthy();
    });

    test("로그인완료모달의 확인 버튼 클릭시 일기목록 페이지로 이동해야 한다", async ({ page }) => {
      // 폼 입력 및 제출
      await page.fill('[data-testid="login-email-input"]', "a@c.com");
      await page.fill('[data-testid="login-password-input"]', "1234qwer");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await submitButton.click();
      
      // 로그인완료모달 대기
      const successModal = page.locator('[data-testid="login-success-modal"]');
      await expect(successModal).toBeVisible({ timeout: 5000 });
      
      // 확인 버튼 클릭
      const confirmButton = successModal.locator('button').filter({ hasText: '확인' });
      await confirmButton.click();
      
      // 일기목록 페이지로 이동 확인
      await expect(page).toHaveURL("/diaries");
      
      // 모든 모달이 닫혔는지 확인
      await expect(successModal).not.toBeVisible();
    });
  });

  test.describe("로그인 API - 실패 시나리오", () => {
    test("잘못된 이메일/비밀번호로 로그인시 로그인실패모달이 표시되어야 한다", async ({ page }) => {
      // API 모킹 - 로그인 실패 응답
      await page.route("**/graphql", async (route) => {
        const postData = route.request().postData();
        if (postData && postData.includes("loginUser")) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              errors: [{
                message: "이메일 또는 비밀번호가 올바르지 않습니다.",
                extensions: {
                  code: "UNAUTHENTICATED"
                }
              }]
            }),
          });
        } else {
          await route.continue();
        }
      });
      
      // 폼 입력
      await page.fill('[data-testid="login-email-input"]', "wrong@example.com");
      await page.fill('[data-testid="login-password-input"]', "wrongpassword");
      
      // 로그인 버튼 클릭
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await submitButton.click();
      
      // 로그인실패모달이 표시될 때까지 대기
      const errorModal = page.locator('[data-testid="login-error-modal"]');
      await expect(errorModal).toBeVisible({ timeout: 2000 });
      
      // 모달 내용 확인
      await expect(errorModal).toContainText("로그인 실패");
    });

    test("로그인실패모달의 확인 버튼 클릭시 모달이 닫혀야 한다", async ({ page }) => {
      // API 모킹 - 에러 응답
      await page.route("**/graphql", async (route) => {
        const postData = route.request().postData();
        if (postData && postData.includes("loginUser")) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              errors: [{
                message: "로그인에 실패했습니다."
              }]
            }),
          });
        } else {
          await route.continue();
        }
      });
      
      // 폼 입력 및 제출
      await page.fill('[data-testid="login-email-input"]', "error@example.com");
      await page.fill('[data-testid="login-password-input"]', "errorpassword");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await submitButton.click();
      
      // 로그인실패모달 대기
      const errorModal = page.locator('[data-testid="login-error-modal"]');
      await expect(errorModal).toBeVisible({ timeout: 2000 });
      
      // 확인 버튼 클릭
      const confirmButton = errorModal.locator('button').filter({ hasText: '확인' });
      await confirmButton.click();
      
      // 모달이 닫혔는지 확인
      await expect(errorModal).not.toBeVisible();
      
      // 페이지는 여전히 로그인 페이지에 있어야 함
      await expect(page).toHaveURL("/auth/login");
    });

    test("네트워크 에러 발생시 로그인실패모달이 표시되어야 한다", async ({ page }) => {
      // API 모킹 - 네트워크 에러
      await page.route("**/graphql", async (route) => {
        const postData = route.request().postData();
        if (postData && postData.includes("loginUser")) {
          await route.abort("failed");
        } else {
          await route.continue();
        }
      });
      
      // 폼 입력 및 제출
      await page.fill('[data-testid="login-email-input"]', "network@example.com");
      await page.fill('[data-testid="login-password-input"]', "networkpassword");
      
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await submitButton.click();
      
      // 로그인실패모달이 표시될 때까지 대기
      const errorModal = page.locator('[data-testid="login-error-modal"]');
      await expect(errorModal).toBeVisible({ timeout: 2000 });
    });
  });

  test.describe("회원가입 페이지 링크", () => {
    test("회원가입 링크 클릭시 회원가입 페이지로 이동해야 한다", async ({ page }) => {
      const signupLink = page.locator('[data-testid="signup-link"]');
      await signupLink.click();
      
      await expect(page).toHaveURL("/auth/signup");
    });
  });
});

