import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

/**
 * Diaries Detail Delete Hook 테스트
 *
 * 테스트 시나리오:
 * 1. /diaries/[id]에 접속하여 페이지 로드 확인
 * 2. 삭제 버튼 클릭
 * 3. 일기삭제 모달이 노출됨을 확인
 * 4. "취소" 클릭: 모달 닫기
 * 5. "삭제" 클릭: API를 통해 해당 일기를 삭제 후 /diaries로 페이지 이동
 *
 * 테스트 대상:
 * - useDeleteHook Hook
 * - API를 통한 데이터 삭제
 * - 다이나믹 라우팅 [id] 추출
 *
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - API 모킹 사용
 * - EmotionType enum 타입 사용
 */

test.describe("일기 삭제 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 상태 설정
    await page.addInitScript(() => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem("user", JSON.stringify({ _id: "test-user-123", name: "테스트 유저" }));
    });

    // 테스트용 일기 데이터 생성 (본인 일기)
    const testUserId = "test-user-123";
    const testDiary = {
      id: 1,
      title: "테스트 일기",
      content: "테스트 내용",
      emotion: EmotionType.Happy,
      createdAt: "2024-07-12T08:57:49.537Z",
      userId: testUserId, // 본인 일기
    };

    // API 모킹
    await page.route("**/api/diaries*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ diaries: [testDiary] }),
        });
      } else if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      }
    });

    // 상세 페이지로 이동
    await page.goto("/diaries/1");

    // 페이지 로드 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
    });
  });

  test("삭제 버튼을 클릭하면 삭제 모달이 노출되어야 한다", async ({ page }) => {
    // Given: 일기 상세 페이지가 로드됨
    await expect(page.locator('[data-testid="diary-title"]')).toBeVisible();

    // When: 삭제 버튼 클릭
    const deleteButton = page.locator("button:has-text('삭제')");
    await deleteButton.click();

    // Then: 삭제 모달이 노출되어야 함
    await expect(
      page.locator('[data-testid="diary-delete-modal"]')
    ).toBeVisible();

    // And: 모달 제목이 표시되어야 함
    await expect(
      page.locator('[data-testid="diary-delete-modal-title"]')
    ).toHaveText("일기 삭제");

    // And: 모달 설명이 표시되어야 함
    await expect(
      page.locator('[data-testid="diary-delete-modal-description"]')
    ).toHaveText("일기를 삭제 하시겠어요?");
  });

  test("삭제 모달에서 취소 버튼을 클릭하면 모달이 닫혀야 한다", async ({
    page,
  }) => {
    // Given: 삭제 모달이 열려있음
    const deleteButton = page.locator("button:has-text('삭제')");
    await deleteButton.click();
    await expect(
      page.locator('[data-testid="diary-delete-modal"]')
    ).toBeVisible();

    // When: 취소 버튼 클릭
    const cancelButton = page.locator(
      '[data-testid="diary-delete-modal-cancel-button"]'
    );
    await cancelButton.click();

    // Then: 모달이 닫혀야 함
    await expect(
      page.locator('[data-testid="diary-delete-modal"]')
    ).not.toBeVisible();

    // And: 일기 상세 페이지가 그대로 표시되어야 함
    await expect(page.locator('[data-testid="diary-title"]')).toBeVisible();
  });

  test("삭제 모달에서 삭제 버튼을 클릭하면 일기가 삭제되고 /diaries로 이동해야 한다", async ({
    page,
  }) => {
    // Given: 삭제 모달이 열려있음
    const deleteButton = page.locator("button:has-text('삭제')");
    await deleteButton.click();
    await expect(
      page.locator('[data-testid="diary-delete-modal"]')
    ).toBeVisible();

    // When: 삭제 버튼 클릭
    const confirmDeleteButton = page.locator(
      '[data-testid="diary-delete-modal-delete-button"]'
    );
    await confirmDeleteButton.click();

    // Then: /diaries 페이지로 이동해야 함
    await page.waitForURL("**/diaries");
    await expect(page).toHaveURL(/\/diaries$/);
  });
});
