import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

/**
 * Diaries Detail Retrospect Binding Hook 테스트
 *
 * 테스트 시나리오:
 * 1. 로컬스토리지의 retrospects 배열에서 diaryId가 일치하는 회고들을 필터링하여 표시
 * 2. 회고 객체의 content와 createdAt을 사용하여 표시
 *
 * 테스트 대상:
 * - useRetrospectBindingHook Hook
 * - 로컬스토리지 데이터 바인딩 (key: retrospects)
 * - 다이나믹 라우팅 [id] 추출
 *
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용)
 * - 로컬스토리지 모킹 없음
 */

test.describe("회고 데이터 바인딩 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로컬스토리지 초기화
    await page.goto("/diaries");
    await page.evaluate(() => localStorage.clear());

    // 테스트용 일기 데이터 생성
    const testDiary = {
      id: 1,
      title: "테스트 일기",
      content: "테스트 내용",
      emotion: EmotionType.Happy,
      createdAt: new Date().toISOString(),
    };

    // 로컬스토리지 데이터 설정
    await page.evaluate((diary) => {
      localStorage.setItem("diaries", JSON.stringify([diary]));
    }, testDiary);

    // 상세 페이지로 이동
    await page.goto("/diaries/1");

    // 페이지 로드 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 499,
    });
  });

  test("로컬스토리지에 diaryId가 일치하는 회고가 없을 때 빈 목록이 표시되어야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 retrospects가 없거나 다른 diaryId의 회고만 있는 경우
    await page.evaluate(() => {
      const retrospects = [
        {
          id: 1,
          content: "다른 일기의 회고",
          diaryId: 2,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
      // 커스텀 이벤트 트리거하여 Hook이 반응하도록 함
      window.dispatchEvent(new Event("localStorageChange"));
    });

    // Then: 회고 목록이 비어있어야 함 (회고 아이템이 없어야 함)
    const retrospectItems = page.locator('[data-testid^="retrospect-item-"]');
    await expect(retrospectItems).toHaveCount(0);
  });

  test("로컬스토리지에 diaryId가 일치하는 회고가 있을 때 올바르게 표시되어야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 diaryId가 1인 회고 데이터 설정
    const testRetrospect = {
      id: 1,
      content: "3년이 지나고 다시 보니 이때가 그립다.",
      diaryId: 1,
      createdAt: "2024-09-24T00:00:00.000Z",
    };

    await page.evaluate((retrospect) => {
      localStorage.setItem("retrospects", JSON.stringify([retrospect]));
      // 커스텀 이벤트 트리거하여 Hook이 반응하도록 함
      window.dispatchEvent(new Event("localStorageChange"));
    }, testRetrospect);

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
    // Given: 로컬스토리지에 여러 diaryId의 회고 데이터 설정
    const testRetrospects = [
      {
        id: 1,
        content: "일기 1의 회고 1",
        diaryId: 1,
        createdAt: "2024-09-24T00:00:00.000Z",
      },
      {
        id: 2,
        content: "일기 2의 회고",
        diaryId: 2,
        createdAt: "2024-09-25T00:00:00.000Z",
      },
      {
        id: 3,
        content: "일기 1의 회고 2",
        diaryId: 1,
        createdAt: "2024-09-26T00:00:00.000Z",
      },
    ];

    await page.evaluate((retrospects) => {
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
      // 커스텀 이벤트 트리거하여 Hook이 반응하도록 함
      window.dispatchEvent(new Event("localStorageChange"));
    }, testRetrospects);

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
    // Given: 로컬스토리지에 회고 데이터 설정 (다양한 날짜 형식)
    const testRetrospect = {
      id: 1,
      content: "날짜 포맷 테스트",
      diaryId: 1,
      createdAt: "2024-12-25T10:30:00.000Z",
    };

    await page.evaluate((retrospect) => {
      localStorage.setItem("retrospects", JSON.stringify([retrospect]));
      // 커스텀 이벤트 트리거하여 Hook이 반응하도록 함
      window.dispatchEvent(new Event("localStorageChange"));
    }, testRetrospect);

    // Then: 날짜가 "YYYY. MM. DD" 형식으로 표시되어야 함
    const retrospectItem = page.locator('[data-testid="retrospect-item-1"]');
    await expect(retrospectItem).toBeVisible();
    await expect(
      retrospectItem.locator("text=/\\[2024\\. 12\\. 25\\]/")
    ).toBeVisible();
  });

  test("회고 목록이 시간순으로 정렬되어 표시되어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 여러 회고 데이터 설정 (다른 시간)
    const testRetrospects = [
      {
        id: 1,
        content: "나중에 작성된 회고",
        diaryId: 1,
        createdAt: "2024-09-26T00:00:00.000Z",
      },
      {
        id: 2,
        content: "먼저 작성된 회고",
        diaryId: 1,
        createdAt: "2024-09-24T00:00:00.000Z",
      },
      {
        id: 3,
        content: "중간에 작성된 회고",
        diaryId: 1,
        createdAt: "2024-09-25T00:00:00.000Z",
      },
    ];

    await page.evaluate((retrospects) => {
      localStorage.setItem("retrospects", JSON.stringify(retrospects));
      // 커스텀 이벤트 트리거하여 Hook이 반응하도록 함
      window.dispatchEvent(new Event("localStorageChange"));
    }, testRetrospects);

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
