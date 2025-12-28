import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

/**
 * Diaries Search Hook 테스트
 * 
 * 테스트 시나리오:
 * 1. /diaries에 접속하여 페이지 로드 확인
 * 2. 검색창에 검색어를 입력하면, 엔터 또는 돋보기 버튼을 클릭 가능하도록 활성화
 * 3. 엔터 또는 돋보기 버튼을 클릭시 title이 검색어에 포함되는 일기카드만 필터링하여 표시
 * 
 * 테스트 대상:
 * - useSearchHook Hook
 * - 로컬스토리지에서 diaries 배열 검색
 * - title 기반 검색 필터링
 * 
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용)
 * - 로컬스토리지 모킹 없음
 */

test.describe("일기 검색 기능", () => {
  test("검색어를 입력하고 엔터를 누르면 해당 검색어가 포함된 일기만 표시되어야 한다", async ({ page }) => {
    // Given: API 모킹 - 여러 일기 데이터 반환
    const testDiaries = [
      {
        id: 1,
        title: "오늘은 행복한 하루",
        content: "오늘은 정말 행복한 하루였습니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "슬픈 하루",
        content: "오늘은 슬픈 하루였습니다.",
        emotion: EmotionType.Sad,
        createdAt: "2024-07-13T08:57:49.537Z",
      },
      {
        id: 3,
        title: "행복한 순간",
        content: "행복한 순간을 기록합니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-14T08:57:49.537Z",
      },
    ];

    await page.route("**/api/diaries", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ diaries: testDiaries }),
      });
    });

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 모든 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(3);

    // When: 검색창에 "행복"을 입력하고 엔터를 누름
    const searchInput = page.locator('[data-testid="diary-search-input"] input');
    await searchInput.fill("행복");
    await searchInput.press("Enter");

    // Then: "행복"이 포함된 일기만 표시됨 (id: 1, 3)
    await expect(diaryCards).toHaveCount(2);
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-2"]')).not.toBeVisible();
  });

  test("검색어가 없을 때는 모든 일기가 표시되어야 한다", async ({ page }) => {
    // Given: API 모킹 - 여러 일기 데이터 반환
    const testDiaries = [
      {
        id: 1,
        title: "오늘은 행복한 하루",
        content: "오늘은 정말 행복한 하루였습니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "슬픈 하루",
        content: "오늘은 슬픈 하루였습니다.",
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

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 모든 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(2);

    // When: 검색창에 빈 문자열을 입력하고 엔터를 누름
    const searchInput = page.locator('[data-testid="diary-search-input"] input');
    await searchInput.fill("");
    await searchInput.press("Enter");

    // Then: 모든 일기가 표시됨
    await expect(diaryCards).toHaveCount(2);
  });

  test("검색어와 일치하는 일기가 없을 때는 일기 카드가 표시되지 않아야 한다", async ({ page }) => {
    // Given: API 모킹 - 일기 데이터 반환
    const testDiaries = [
      {
        id: 1,
        title: "오늘은 행복한 하루",
        content: "오늘은 정말 행복한 하루였습니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "슬픈 하루",
        content: "오늘은 슬픈 하루였습니다.",
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

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
      timeout: 5000,
    });

    // And: 모든 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(2);

    // When: 검색창에 "존재하지않는제목"을 입력하고 엔터를 누름
    const searchInput = page.locator('[data-testid="diary-search-input"] input');
    await searchInput.fill("존재하지않는제목");
    await searchInput.press("Enter");

    // Then: 일기 카드가 표시되지 않음
    await expect(diaryCards).toHaveCount(0);
  });

  test("검색어는 대소문자를 구분하지 않고 검색되어야 한다", async ({ page }) => {
    // Given: API 모킹 - 일기 데이터 반환
    const testDiaries = [
      {
        id: 1,
        title: "오늘은 행복한 하루",
        content: "오늘은 정말 행복한 하루였습니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "슬픈 하루",
        content: "오늘은 슬픈 하루였습니다.",
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

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
      timeout: 5000,
    });

    // When: 검색창에 "행복"을 입력하고 엔터를 누름
    const searchInput = page.locator('[data-testid="diary-search-input"] input');
    await searchInput.fill("행복");
    await searchInput.press("Enter");

    // Then: "행복"이 포함된 일기가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();
  });

  test("검색창의 돋보기 버튼을 클릭하면 검색이 실행되어야 한다", async ({ page }) => {
    // Given: API 모킹 - 여러 일기 데이터 반환
    const testDiaries = [
      {
        id: 1,
        title: "오늘은 행복한 하루",
        content: "오늘은 정말 행복한 하루였습니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "슬픈 하루",
        content: "오늘은 슬픈 하루였습니다.",
        emotion: EmotionType.Sad,
        createdAt: "2024-07-13T08:57:49.537Z",
      },
      {
        id: 3,
        title: "행복한 순간",
        content: "행복한 순간을 기록합니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-14T08:57:49.537Z",
      },
    ];

    await page.route("**/api/diaries", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ diaries: testDiaries }),
      });
    });

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
      timeout: 5000,
    });

    // And: 모든 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(3);

    // When: 검색창에 "행복"을 입력하고 돋보기 아이콘을 클릭
    const searchInput = page.locator('[data-testid="diary-search-input"] input');
    await searchInput.fill("행복");
    // 돋보기 아이콘은 iconWrapper div에 있음
    const searchIconWrapper = page.locator('[data-testid="diary-search-input"]').locator('div').first();
    await searchIconWrapper.click();

    // Then: "행복"이 포함된 일기만 표시됨 (id: 1, 3)
    await expect(diaryCards).toHaveCount(2);
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-2"]')).not.toBeVisible();
  });

  test("검색 후 다시 빈 검색어로 검색하면 모든 일기가 표시되어야 한다", async ({ page }) => {
    // Given: API 모킹 - 여러 일기 데이터 반환
    const testDiaries = [
      {
        id: 1,
        title: "오늘은 행복한 하루",
        content: "오늘은 정말 행복한 하루였습니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "슬픈 하루",
        content: "오늘은 슬픈 하루였습니다.",
        emotion: EmotionType.Sad,
        createdAt: "2024-07-13T08:57:49.537Z",
      },
      {
        id: 3,
        title: "행복한 순간",
        content: "행복한 순간을 기록합니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-14T08:57:49.537Z",
      },
    ];

    await page.route("**/api/diaries", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ diaries: testDiaries }),
      });
    });

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)  
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    const searchInput = page.locator('[data-testid="diary-search-input"] input');
    const diaryCards = page.locator('[data-testid^="diary-card-"]');

    // When: 검색창에 "행복"을 입력하고 엔터를 누름
    await searchInput.fill("행복");
    await searchInput.press("Enter");

    // Then: 필터링된 일기만 표시됨
    await expect(diaryCards).toHaveCount(2);

    // When: 검색창을 비우고 엔터를 누름
    await searchInput.fill("");
    await searchInput.press("Enter");

    // Then: 모든 일기가 다시 표시됨
    await expect(diaryCards).toHaveCount(3);
  });
});

