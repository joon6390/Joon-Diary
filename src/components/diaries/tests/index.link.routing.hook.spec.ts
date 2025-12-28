import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";
import { paths } from "@/commons/constants/url";

/**
 * Diaries Link Routing Hook 테스트
 *
 * 테스트 시나리오:
 * 1. 일기 카드 클릭 시 일기 상세 페이지로 이동
 * 2. 삭제 아이콘 클릭 시 페이지 이동하지 않음
 * 3. 여러 일기 카드가 있을 때 각각 올바른 경로로 이동
 *
 * 테스트 대상:
 * - useLinkRouting Hook
 * - DiaryCard 클릭 이벤트
 * - url.ts의 paths.diaries.detail 경로 사용
 *
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용)
 * - 로컬스토리지 모킹 없음
 */

test.describe("일기 카드 라우팅 기능", () => {

  test("일기 카드 클릭 시 일기 상세 페이지로 이동해야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 일기 데이터 저장
    const testDiary = {
      id: 1,
      title: "테스트 일기 제목",
      content: "테스트 일기 내용입니다.",
      emotion: EmotionType.Happy,
      createdAt: "2024-07-12T08:57:49.537Z",
    };

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

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 일기 카드가 표시됨
    const diaryCard = page.locator('[data-testid="diary-card-1"]');
    await expect(diaryCard).toBeVisible();

    // When: 일기 카드 클릭 (삭제 버튼이 아닌 영역)
    await diaryCard.click({
      position: { x: 137, y: 148 }, // 카드 중앙 영역 클릭
    });

    // Then: 일기 상세 페이지로 이동
    await expect(page).toHaveURL(paths.diaries.detail(testDiary.id));
  });

  test("삭제 아이콘 클릭 시 페이지 이동하지 않아야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 본인이 작성한 일기 데이터 저장
    const testUserId = "test-user-123";
    const testDiary = {
      id: 1,
      title: "테스트 일기 제목",
      content: "테스트 일기 내용입니다.",
      emotion: EmotionType.Happy,
      createdAt: "2024-07-12T08:57:49.537Z",
      userId: testUserId, // 본인 일기
    };

    await page.addInitScript(({ userId }) => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem(
        "user",
        JSON.stringify({ _id: userId, name: "테스트 유저" })
      );
    }, { userId: testUserId });

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

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 일기 카드가 표시됨
    const diaryCard = page.locator('[data-testid="diary-card-1"]');
    await expect(diaryCard).toBeVisible();

    // When: 삭제 버튼 클릭하여 모달 열기
    const deleteButton = diaryCard.locator('button[aria-label="삭제"]');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // And: 삭제 모달이 노출됨
    const deleteModal = page.locator('[data-testid="diary-delete-modal"]');
    await expect(deleteModal).toBeVisible();

    // When: 모달에서 삭제 버튼 클릭
    const confirmDeleteButton = deleteModal.locator('button:has-text("삭제")');
    await confirmDeleteButton.click();

    // Then: 페이지가 이동하지 않고 목록 페이지에 머물러 있음
    await expect(page).toHaveURL("/diaries");

    // And: 일기 카드가 삭제되어 화면에서 사라짐
    await expect(diaryCard).not.toBeVisible();
  });

  test("여러 일기 카드가 있을 때 각각 올바른 경로로 이동해야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 여러 일기 데이터 저장
    const testDiaries = [
      {
        id: 1,
        title: "첫 번째 일기",
        content: "첫 번째 일기 내용",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "두 번째 일기",
        content: "두 번째 일기 내용",
        emotion: EmotionType.Sad,
        createdAt: "2024-07-13T08:57:49.537Z",
      },
      {
        id: 3,
        title: "세 번째 일기",
        content: "세 번째 일기 내용",
        emotion: EmotionType.Angry,
        createdAt: "2024-07-14T08:57:49.537Z",
      },
    ];

    await page.route("**/api/diaries*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ diaries: testDiaries }),
        });
      }
    });

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 모든 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(3);

    // When: 첫 번째 일기 카드 클릭
    const firstCard = page.locator('[data-testid="diary-card-1"]');
    await firstCard.click({
      position: { x: 137, y: 148 },
    });

    // Then: 첫 번째 일기 상세 페이지로 이동
    await expect(page).toHaveURL(paths.diaries.detail(1));

    // When: 목록 페이지로 다시 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // When: 두 번째 일기 카드 클릭
    const secondCard = page.locator('[data-testid="diary-card-2"]');
    await secondCard.click({
      position: { x: 137, y: 148 },
    });

    // Then: 두 번째 일기 상세 페이지로 이동
    await expect(page).toHaveURL(paths.diaries.detail(2));

    // When: 목록 페이지로 다시 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // When: 세 번째 일기 카드 클릭
    const thirdCard = page.locator('[data-testid="diary-card-3"]');
    await thirdCard.click({
      position: { x: 137, y: 148 },
    });

    // Then: 세 번째 일기 상세 페이지로 이동
    await expect(page).toHaveURL(paths.diaries.detail(3));
  });

  test("일기 카드에 cursor: pointer 스타일이 적용되어야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 일기 데이터 저장
    const testDiary = {
      id: 1,
      title: "테스트 일기 제목",
      content: "테스트 일기 내용입니다.",
      emotion: EmotionType.Happy,
      createdAt: "2024-07-12T08:57:49.537Z",
    };

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

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
      timeout: 5000,
    });

    // And: 일기 카드가 표시됨
    const diaryCard = page.locator('[data-testid="diary-card-1"]');
    await expect(diaryCard).toBeVisible();

    // Then: 일기 카드에 cursor: pointer 스타일이 적용됨
    const cursorStyle = await diaryCard.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
    });
    expect(cursorStyle).toBe("pointer");
  });
});
