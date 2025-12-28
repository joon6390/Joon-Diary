import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

/**
 * Diaries Delete Hook 테스트
 *
 * 테스트 시나리오:
 * 1. 비로그인 유저: 일기카드 각각의 삭제아이콘(X) 미노출 확인
 * 2. 로그인 유저: 일기카드 각각의 삭제아이콘(X) 노출 확인
 * 3. 로그인 유저: 삭제아이콘(X) 클릭 시 일기삭제 모달 노출 확인
 * 4. 로그인 유저: 모달에서 취소 클릭 시 모달 닫기 확인
 * 5. 로그인 유저: 모달에서 삭제 클릭 시 API를 통해 일기 삭제 및 페이지 새로고침 확인
 *
 * 테스트 대상:
 * - useDeleteHook Hook
 * - API를 통한 일기 삭제
 * - emotion enum 타입 활용
 * - 권한 분기 (액션GUARD)
 *
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - API 모킹 사용
 */

test.describe("일기 삭제 기능", () => {
  test.beforeEach(async ({ page }) => {
    // API 모킹 설정
    await page.route("**/api/diaries*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ diaries: [] }),
        });
      } else if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      }
    });
  });

  test("비로그인 유저일 때 일기카드 각각의 삭제아이콘(X)이 미노출되어야 한다", async ({
    page,
  }) => {
    // Given: API 모킹 - 일기 데이터 반환
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
    ];

    await page.route("**/api/diaries", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ diaries: testDiaries }),
      });
    });

    // And: 비로그인 유저 설정 (액션GUARD 활성화)
    await page.evaluate(() => {
      (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ =
        false;
    });

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 일기 카드들이 표시됨
    const diaryCard1 = page.locator('[data-testid="diary-card-1"]');
    const diaryCard2 = page.locator('[data-testid="diary-card-2"]');
    await expect(diaryCard1).toBeVisible();
    await expect(diaryCard2).toBeVisible();

    // Then: 삭제 아이콘이 표시되지 않아야 함
    const deleteButton1 = diaryCard1.locator('button[aria-label="삭제"]');
    const deleteButton2 = diaryCard2.locator('button[aria-label="삭제"]');
    await expect(deleteButton1).not.toBeVisible();
    await expect(deleteButton2).not.toBeVisible();
  });

  test("로그인 유저일 때 본인이 작성한 일기카드에만 삭제아이콘(X)이 노출되어야 한다", async ({
    page,
  }) => {
    // Given: API 모킹 - 일기 데이터 반환 (본인 일기와 다른 사람 일기)
    const testUserId = "test-user-123";
    const testDiaries = [
      {
        id: 1,
        title: "본인이 작성한 일기",
        content: "첫 번째 일기 내용",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
        userId: testUserId, // 본인 일기
      },
      {
        id: 2,
        title: "다른 사람이 작성한 일기",
        content: "두 번째 일기 내용",
        emotion: EmotionType.Sad,
        createdAt: "2024-07-13T08:57:49.537Z",
        userId: "other-user-456", // 다른 사람 일기
      },
    ];

    await page.route("**/api/diaries", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ diaries: testDiaries }),
      });
    });

    // 로그인 유저 설정 - addInitScript 사용
    await page.addInitScript((userId) => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem("user", JSON.stringify({ _id: userId, name: "테스트 유저" }));
    }, testUserId);

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 일기 카드들이 표시됨
    const diaryCard1 = page.locator('[data-testid="diary-card-1"]');
    const diaryCard2 = page.locator('[data-testid="diary-card-2"]');
    await expect(diaryCard1).toBeVisible();
    await expect(diaryCard2).toBeVisible();

    // Then: 본인이 작성한 일기(1번)에만 삭제 아이콘이 표시되어야 함
    const deleteButton1 = diaryCard1.locator('button[aria-label="삭제"]');
    const deleteButton2 = diaryCard2.locator('button[aria-label="삭제"]');
    await expect(deleteButton1).toBeVisible();
    await expect(deleteButton2).not.toBeVisible();
  });

  test("로그인 유저가 삭제아이콘(X)을 클릭하면 일기삭제 모달이 노출되어야 한다", async ({
    page,
  }) => {
    // Given: API 모킹 - 본인이 작성한 일기 데이터 반환
    const testUserId = "test-user-123";
    const testDiary = {
      id: 1,
      title: "테스트 일기",
      content: "테스트 내용",
      emotion: EmotionType.Happy,
      createdAt: "2024-07-12T08:57:49.537Z",
      userId: testUserId, // 본인 일기
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

    // 로그인 유저 설정 - addInitScript 사용
    await page.addInitScript((userId) => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem("user", JSON.stringify({ _id: userId, name: "테스트 유저" }));
    }, testUserId);

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 일기 카드가 표시됨
    const diaryCard = page.locator('[data-testid="diary-card-1"]');
    await expect(diaryCard).toBeVisible();

    // When: 삭제 버튼 클릭
    const deleteButton = diaryCard.locator('button[aria-label="삭제"]');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // Then: 일기 삭제 모달이 노출되어야 함
    const deleteModal = page.locator('[data-testid="diary-delete-modal"]');
    await expect(deleteModal).toBeVisible();

    // And: 모달 제목과 설명이 표시되어야 함
    await expect(deleteModal.locator("text=일기 삭제")).toBeVisible();
    await expect(
      deleteModal.locator("text=일기를 삭제 하시겠어요?")
    ).toBeVisible();

    // And: 취소 버튼과 삭제 버튼이 표시되어야 함
    await expect(deleteModal.locator('button:has-text("취소")')).toBeVisible();
    await expect(deleteModal.locator('button:has-text("삭제")')).toBeVisible();
  });

  test("로그인 유저가 모달에서 취소를 클릭하면 모달이 닫혀야 한다", async ({
    page,
  }) => {
    // Given: API 모킹 - 본인이 작성한 일기 데이터 반환
    const testUserId = "test-user-123";
    const testDiary = {
      id: 1,
      title: "테스트 일기",
      content: "테스트 내용",
      emotion: EmotionType.Happy,
      createdAt: "2024-07-12T08:57:49.537Z",
      userId: testUserId, // 본인 일기
    };

    await page.route("**/api/diaries*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ diaries: [testDiary] }),
        });
      }
    });

    // 로그인 유저 설정 - addInitScript 사용
    await page.addInitScript((userId) => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem("user", JSON.stringify({ _id: userId, name: "테스트 유저" }));
    }, testUserId);

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

    // And: 모달이 노출됨
    const deleteModal = page.locator('[data-testid="diary-delete-modal"]');
    await expect(deleteModal).toBeVisible();

    // When: 취소 버튼 클릭
    const cancelButton = deleteModal.locator('button:has-text("취소")');
    await cancelButton.click();

    // Then: 모달이 닫혀야 함
    await expect(deleteModal).not.toBeVisible();

    // And: 일기 카드가 여전히 표시되어야 함 (삭제되지 않음)
    await expect(diaryCard).toBeVisible();
  });

  test("로그인 유저가 모달에서 삭제를 클릭하면 일기가 삭제되고 페이지가 새로고침되어야 한다", async ({
    page,
  }) => {
    // Given: API 모킹 - 여러 일기 데이터 반환 (본인 일기만 포함)
    const testUserId = "test-user-123";
    const testDiaries = [
      {
        id: 1,
        title: "첫 번째 일기",
        content: "첫 번째 일기 내용",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
        userId: testUserId, // 본인 일기
      },
      {
        id: 2,
        title: "두 번째 일기",
        content: "두 번째 일기 내용",
        emotion: EmotionType.Sad,
        createdAt: "2024-07-13T08:57:49.537Z",
        userId: testUserId, // 본인 일기
      },
    ];

    let deletedId: number | null = null;

    await page.route("**/api/diaries*", async (route) => {
      if (route.request().method() === "GET") {
        // 삭제 후에는 첫 번째 일기를 제외한 목록 반환
        const filtered = testDiaries.filter((d) => d.id !== deletedId);
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ diaries: filtered }),
        });
      } else if (route.request().method() === "DELETE") {
        const url = new URL(route.request().url());
        deletedId = parseInt(url.searchParams.get("id") || "0");
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true }),
        });
      }
    });

    // 로그인 유저 설정 - addInitScript 사용
    await page.addInitScript((userId) => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem("user", JSON.stringify({ _id: userId, name: "테스트 유저" }));
    }, testUserId);

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 일기 카드들이 표시됨
    const diaryCard1 = page.locator('[data-testid="diary-card-1"]');
    const diaryCard2 = page.locator('[data-testid="diary-card-2"]');
    await expect(diaryCard1).toBeVisible();
    await expect(diaryCard2).toBeVisible();

    // When: 첫 번째 일기의 삭제 버튼 클릭
    const deleteButton = diaryCard1.locator('button[aria-label="삭제"]');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();

    // And: 모달이 노출됨
    const deleteModal = page.locator('[data-testid="diary-delete-modal"]');
    await expect(deleteModal).toBeVisible();

    // When: 삭제 버튼 클릭
    const confirmDeleteButton = deleteModal.locator('button:has-text("삭제")');
    await confirmDeleteButton.click();

    // Then: 페이지가 새로고침되고 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 첫 번째 일기 카드가 삭제되어 표시되지 않아야 함
    await expect(diaryCard1).not.toBeVisible();

    // And: 두 번째 일기 카드는 여전히 표시되어야 함
    await expect(page.locator('[data-testid="diary-card-2"]')).toBeVisible();

    // And: 첫 번째 일기가 삭제되어야 함 (API를 통해 삭제됨)
    expect(deletedId).toBe(1);
  });
});
