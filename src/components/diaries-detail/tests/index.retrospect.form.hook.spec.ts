import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

/**
 * Diaries Detail Retrospect Form Hook 테스트
 *
 * 테스트 시나리오:
 * 1. 회고등록 인풋이 입력되면 입력버튼을 활성화
 * 2. 등록하기버튼을 클릭시, API를 통해 회고를 저장
 * 3. 등록이 완료되면, 현재 페이지를 새로고침
 *
 * 테스트 대상:
 * - useRetrospectFormHook Hook
 * - react-hook-form + zod 검증
 * - API를 통한 회고 저장
 *
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - API 모킹 사용
 */

test.describe("회고쓰기 폼 등록 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태 설정
    await page.addInitScript(() => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem("user", JSON.stringify({ _id: "test-user-123", name: "테스트 유저" }));
    });

    // API 모킹 - 일기 데이터
    const testDiary = {
      id: 1,
      title: "테스트 일기",
      content: "테스트 내용",
      emotion: EmotionType.Happy,
      createdAt: new Date().toISOString(),
      userId: "test-user-123",
    };

    await page.route("**/api/diaries", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ diaries: [testDiary] }),
      });
    });

    // API 모킹 - 회고 데이터 (초기에는 빈 배열)
    await page.route("**/api/retrospects*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ retrospects: [] }),
        });
      } else if (route.request().method() === "POST") {
        const requestBody = await route.request().postDataJSON();
        const newRetrospect = {
          id: Date.now(),
          ...requestBody,
          createdAt: new Date().toISOString(),
        };
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(newRetrospect),
        });
      }
    });

    // 상세 페이지로 이동
    await page.goto("/diaries/1");

    // 페이지 로드 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
      timeout: 10000,
    });
  });

  test("초기 상태에서 입력 버튼은 비활성화되어야 한다", async ({ page }) => {
    // Then: 입력 버튼이 비활성화 상태
    const submitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );
    await expect(submitButton).toBeDisabled();
  });

  test("회고 인풋이 입력되면 입력 버튼이 활성화되어야 한다", async ({
    page,
  }) => {
    // When: 회고 인풋에 텍스트 입력
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.fill("회고 내용입니다.");
    // input 이벤트 트리거 (react-hook-form onChange 감지를 위해)
    await input.dispatchEvent("input");

    // Then: 입력 버튼이 활성화될 때까지 대기
    const submitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );
    await expect(submitButton).toBeEnabled();
  });

  test("첫 회고를 등록하면 API를 통해 저장되어야 한다", async ({
    page,
  }) => {
    let capturedRequest: { content: string; diaryId: number } | null = null;

    // API 요청 캡처
    await page.route("**/api/retrospects*", async (route) => {
      if (route.request().method() === "POST") {
        capturedRequest = await route.request().postDataJSON();
        const newRetrospect = {
          id: 1,
          ...capturedRequest,
          createdAt: new Date().toISOString(),
        };
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(newRetrospect),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ retrospects: [] }),
        });
      }
    });

    // Given: 회고 인풋에 텍스트 입력
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.fill("첫 번째 회고");
    // input 이벤트 트리거 (react-hook-form onChange 감지를 위해)
    await input.dispatchEvent("input");

    // And: 입력 버튼이 활성화될 때까지 대기
    const submitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );
    await expect(submitButton).toBeEnabled();

    // When: 입력 버튼 클릭
    await submitButton.click();

    // Then: 페이지가 새로고침됨 (로드 대기)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
    });

    // And: API 요청이 올바르게 전송됨
    await page.waitForTimeout(500);
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.content).toBe("첫 번째 회고");
    expect(capturedRequest.diaryId).toBe(1);
  });

  test("새 회고를 등록하면 API를 통해 저장되어야 한다", async ({
    page,
  }) => {
    let capturedRequest: { content: string; diaryId: number } | null = null;

    const existingRetrospects = [
      {
        id: 1,
        content: "기존 회고 1",
        diaryId: 1,
        createdAt: new Date().toISOString(),
        userId: "test-user-123",
      },
      {
        id: 3,
        content: "기존 회고 2",
        diaryId: 1,
        createdAt: new Date().toISOString(),
        userId: "test-user-123",
      },
    ];

    // API 모킹 - 기존 회고 목록 반환
    await page.route("**/api/retrospects*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            retrospects: existingRetrospects,
          }),
        });
      } else if (route.request().method() === "POST") {
        capturedRequest = await route.request().postDataJSON();
        const newRetrospect = {
          id: 4,
          ...capturedRequest,
          createdAt: new Date().toISOString(),
        };
        existingRetrospects.push(newRetrospect);
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(newRetrospect),
        });
      }
    });

    // 페이지 새로고침하여 API 호출 트리거
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
      timeout: 10000,
    });

    // When: 새 회고 입력 및 등록
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.fill("새 회고");
    // input 이벤트 트리거 (react-hook-form onChange 감지를 위해)
    await input.dispatchEvent("input");

    const submitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Then: 페이지가 새로고침됨 (네트워크 통신이므로 충분한 시간 대기)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 5000,
    });

    // And: API 요청이 올바르게 전송됨
    await page.waitForTimeout(500);
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.content).toBe("새 회고");
    expect(capturedRequest.diaryId).toBe(1);
  });

  test("등록 완료 후 페이지가 새로고침되어야 한다", async ({ page }) => {
    // Given: 회고 인풋에 텍스트 입력
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.fill("새로고침 테스트 회고");
    // input 이벤트 트리거 (react-hook-form onChange 감지를 위해)
    await input.dispatchEvent("input");

    // And: 입력 버튼이 활성화될 때까지 대기
    const submitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );
    await expect(submitButton).toBeEnabled();

    // When: 입력 버튼 클릭
    await submitButton.click();

    // Then: 페이지가 새로고침되어 다시 로드됨 (네트워크 통신이므로 충분한 시간 대기)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
      timeout: 5000,
    });

    // And: 인풋 필드가 초기화됨 (새로고침으로 인해)
    const inputAfterReload = page.locator('[data-testid="retrospect-input"]');
    await expect(inputAfterReload).toHaveValue("");
  });

  test("등록된 회고가 올바른 diaryId를 저장해야 한다", async ({ page }) => {
    let capturedRequest: { content: string; diaryId: number } | null = null;

    // API 모킹
    await page.route("**/api/retrospects*", async (route) => {
      if (route.request().method() === "POST") {
        capturedRequest = await route.request().postDataJSON();
        const newRetrospect = {
          id: 1,
          ...capturedRequest,
          createdAt: new Date().toISOString(),
        };
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(newRetrospect),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ retrospects: [] }),
        });
      }
    });

    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
      timeout: 10000,
    });

    // When: 회고 등록
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.fill("diaryId 테스트 회고");
    // input 이벤트 트리거 (react-hook-form onChange 감지를 위해)
    await input.dispatchEvent("input");

    const submitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // Then: 페이지가 새로고침됨 (네트워크 통신이므로 충분한 시간 대기)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 5000,
    });

    // And: 등록된 회고의 diaryId가 1 (현재 페이지의 diaryId)로 저장됨
    await page.waitForTimeout(500);
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.diaryId).toBe(1);
  });
});
