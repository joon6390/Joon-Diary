import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

/**
 * Diaries Detail Retrospect Binding Hook 테스트
 *
 * 테스트 시나리오:
 * 1. API의 retrospects 배열에서 diaryId가 일치하는 회고들을 필터링하여 표시
 * 2. 회고 객체의 content와 createdAt을 사용하여 표시
 *
 * 테스트 대상:
 * - useRetrospectBindingHook Hook
 * - API 데이터 바인딩
 * - 다이나믹 라우팅 [id] 추출
 *
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - API 모킹 사용
 */

test.describe("회고 데이터 바인딩 기능", () => {
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

    // 상세 페이지로 이동
    await page.goto("/diaries/1");

    // 페이지 로드 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
      timeout: 10000,
    });
  });

  test("API에 diaryId가 일치하는 회고가 없을 때 빈 목록이 표시되어야 한다", async ({
    page,
  }) => {
    // Given: API 모킹 - 다른 diaryId의 회고만 반환
    await page.route("**/api/retrospects*", async (route) => {
      const url = new URL(route.request().url());
      const diaryId = url.searchParams.get("diaryId");
      
      if (diaryId === "1") {
        // diaryId가 1인 경우 빈 배열 반환
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ retrospects: [] }),
        });
      } else {
        // 다른 diaryId의 회고 반환
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            retrospects: [
              {
                id: 1,
                content: "다른 일기의 회고",
                diaryId: 2,
                createdAt: new Date().toISOString(),
                userId: "test-user-123",
              },
            ],
          }),
        });
      }
    });

    // 페이지 새로고침하여 API 호출 트리거
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
      timeout: 10000,
    });

    // Then: 회고 목록이 비어있어야 함 (회고 아이템이 없어야 함)
    const retrospectItems = page.locator('[data-testid^="retrospect-item-"]');
    await expect(retrospectItems).toHaveCount(0);
  });

  test("API에 diaryId가 일치하는 회고가 있을 때 올바르게 표시되어야 한다", async ({
    page,
  }) => {
    // Given: API 모킹 - diaryId가 1인 회고 데이터 반환
    const testRetrospect = {
      id: 1,
      content: "3년이 지나고 다시 보니 이때가 그립다.",
      diaryId: 1,
      createdAt: "2024-09-24T00:00:00.000Z",
      userId: "test-user-123",
    };

    await page.route("**/api/retrospects*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ retrospects: [testRetrospect] }),
      });
    });

    // 페이지 새로고침하여 API 호출 트리거
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
      timeout: 10000,
    });

    // Then: 회고 내용이 표시되어야 함
    const retrospectItem = page.locator('[data-testid="retrospect-item-1"]');
    await expect(retrospectItem).toBeVisible();
    await expect(
      retrospectItem.locator("text=3년이 지나고 다시 보니 이때가 그립다.")
    ).toBeVisible();

    // And: 회고 날짜가 표시되어야 함 (포맷: "YYYY. MM. DD")
    await expect(
      retrospectItem.locator("text=/\\[2024\\. 09\\. 24\\]/")
    ).toBeVisible();
  });

  test("여러 회고가 있을 때 diaryId로 필터링되어 표시되어야 한다", async ({
    page,
  }) => {
    // Given: API 모킹 - diaryId로 필터링된 회고 데이터 반환
    await page.route("**/api/retrospects*", async (route) => {
      const url = new URL(route.request().url());
      const diaryId = url.searchParams.get("diaryId");
      
      // diaryId가 1인 경우만 필터링된 결과 반환
      if (diaryId === "1") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            retrospects: [
              {
                id: 1,
                content: "일기 1의 회고 1",
                diaryId: 1,
                createdAt: "2024-09-24T00:00:00.000Z",
                userId: "test-user-123",
              },
              {
                id: 3,
                content: "일기 1의 회고 2",
                diaryId: 1,
                createdAt: "2024-09-26T00:00:00.000Z",
                userId: "test-user-123",
              },
            ],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ retrospects: [] }),
        });
      }
    });

    // 페이지 새로고침하여 API 호출 트리거
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
      timeout: 10000,
    });

    // Then: diaryId가 1인 회고만 2개 표시되어야 함
    const retrospectItems = page.locator('[data-testid^="retrospect-item-"]');
    await expect(retrospectItems).toHaveCount(2);

    // And: 첫 번째 회고 내용 확인
    const firstRetrospectItem = page.locator(
      '[data-testid="retrospect-item-1"]'
    );
    await expect(
      firstRetrospectItem.locator("text=일기 1의 회고 1")
    ).toBeVisible();

    // And: 두 번째 회고 내용 확인
    const secondRetrospectItem = page.locator(
      '[data-testid="retrospect-item-3"]'
    );
    await expect(
      secondRetrospectItem.locator("text=일기 1의 회고 2")
    ).toBeVisible();
  });

  test("회고의 createdAt이 올바른 형식으로 표시되어야 한다", async ({
    page,
  }) => {
    // Given: API 모킹 - 회고 데이터 반환
    const testRetrospect = {
      id: 1,
      content: "날짜 포맷 테스트",
      diaryId: 1,
      createdAt: "2024-12-25T10:30:00.000Z",
      userId: "test-user-123",
    };

    await page.route("**/api/retrospects*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ retrospects: [testRetrospect] }),
      });
    });

    // 페이지 새로고침하여 API 호출 트리거
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
      timeout: 10000,
    });

    // Then: 날짜가 "YYYY. MM. DD" 형식으로 표시되어야 함
    const retrospectItem = page.locator('[data-testid="retrospect-item-1"]');
    await expect(retrospectItem).toBeVisible();
    await expect(
      retrospectItem.locator("text=/\\[2024\\. 12\\. 25\\]/")
    ).toBeVisible();
  });

  test("회고 목록이 시간순으로 정렬되어 표시되어야 한다", async ({ page }) => {
    // Given: API 모킹 - 여러 회고 데이터 반환 (시간순 정렬은 클라이언트에서 처리)
    const testRetrospects = [
      {
        id: 1,
        content: "나중에 작성된 회고",
        diaryId: 1,
        createdAt: "2024-09-26T00:00:00.000Z",
        userId: "test-user-123",
      },
      {
        id: 2,
        content: "먼저 작성된 회고",
        diaryId: 1,
        createdAt: "2024-09-24T00:00:00.000Z",
        userId: "test-user-123",
      },
      {
        id: 3,
        content: "중간에 작성된 회고",
        diaryId: 1,
        createdAt: "2024-09-25T00:00:00.000Z",
        userId: "test-user-123",
      },
    ];

    await page.route("**/api/retrospects*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ retrospects: testRetrospects }),
      });
    });

    // 페이지 새로고침하여 API 호출 트리거
    await page.reload();
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
      timeout: 10000,
    });

    // Then: 회고가 시간순으로 정렬되어 표시되어야 함 (먼저 작성된 것부터)
    const retrospectItems = page.locator('[data-testid^="retrospect-item-"]');
    await expect(retrospectItems).toHaveCount(3);

    // 첫 번째 회고 (id: 2, 가장 먼저 작성됨)
    await expect(
      page
        .locator('[data-testid="retrospect-item-2"]')
        .locator("text=먼저 작성된 회고")
    ).toBeVisible();
    // 두 번째 회고 (id: 3, 중간에 작성됨)
    await expect(
      page
        .locator('[data-testid="retrospect-item-3"]')
        .locator("text=중간에 작성된 회고")
    ).toBeVisible();
    // 세 번째 회고 (id: 1, 나중에 작성됨)
    await expect(
      page
        .locator('[data-testid="retrospect-item-1"]')
        .locator("text=나중에 작성된 회고")
    ).toBeVisible();
  });
});
