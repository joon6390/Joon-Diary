import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

/**
 * Diaries Pagination Hook 테스트
 *
 * 테스트 시나리오:
 * 1. /diaries에 접속하여 페이지 로드 확인
 * 2. 한 페이지에 3행 4열로 총 12개의 일기카드가 노출되는지 확인
 * 3. 페이지 번호가 1, 2, 3, 4, 5 형태로 5개 단위로 노출되는지 확인
 * 4. 페이지번호 클릭 시 해당 페이지번호에 맞는 일기 컨텐츠목록 보여지는지 확인
 * 5. 검색 결과에 맞게 페이지 수가 변경되었는지 확인
 * 6. 필터 결과에 맞게 페이지 수가 변경되었는지 확인
 *
 * 테스트 대상:
 * - usePaginationHook Hook
 * - 로컬스토리지에서 diaries 배열 페이지네이션
 * - 검색/필터 결과 페이지네이션
 *
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용)
 * - 로컬스토리지 모킹 없음
 */

test.describe("일기 페이지네이션 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로컬스토리지 초기화
    await page.goto("/diaries");
    await page.evaluate(() => localStorage.clear());
  });

  test("한 페이지에 3행 4열로 총 12개의 일기카드가 노출되어야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 12개 이상의 일기 데이터 저장
    const testDiaries = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `일기 제목 ${i + 1}`,
      content: `일기 내용 ${i + 1}`,
      emotion: EmotionType.Happy,
      createdAt: `2024-07-${String(12 + i).padStart(2, "0")}T08:57:49.537Z`,
    }));

    // When: 목록 페이지로 이동하면서 로컬스토리지 데이터 설정
    await page.goto("/diaries");
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);
    await page.reload();

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 499,
    });

    // Then: 첫 페이지에 정확히 12개의 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(12);
  });

  test("페이지 번호가 1, 2, 3, 4, 5 형태로 5개 단위로 노출되어야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 50개 이상의 일기 데이터 저장 (5페이지 이상)
    const testDiaries = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `일기 제목 ${i + 1}`,
      content: `일기 내용 ${i + 1}`,
      emotion: EmotionType.Happy,
      createdAt: `2024-07-${String(12 + (i % 30)).padStart(
        2,
        "0"
      )}T08:57:49.537Z`,
    }));

    // When: 목록 페이지로 이동하면서 로컬스토리지 데이터 설정
    await page.goto("/diaries");
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);
    await page.reload();

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 499,
    });

    // Then: 페이지 번호 버튼이 5개 표시됨 (1, 2, 3, 4, 5)
    const pageButtons = page.locator('button[aria-label^="페이지"]');
    await expect(pageButtons).toHaveCount(5);

    // Then: 첫 번째 페이지 버튼이 1번임
    await expect(pageButtons.first()).toHaveText("1");
    await expect(pageButtons.last()).toHaveText("5");
  });

  test("페이지번호 클릭 시 해당 페이지번호에 맞는 일기 컨텐츠목록이 보여져야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 25개의 일기 데이터 저장 (3페이지)
    const testDiaries = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `일기 제목 ${i + 1}`,
      content: `일기 내용 ${i + 1}`,
      emotion: EmotionType.Happy,
      createdAt: `2024-07-${String(12 + (i % 30)).padStart(
        2,
        "0"
      )}T08:57:49.537Z`,
    }));

    // When: 목록 페이지로 이동하면서 로컬스토리지 데이터 설정
    await page.goto("/diaries");
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);
    await page.reload();

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // Then: 첫 페이지에 12개의 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(12);
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();

    // When: 2페이지 버튼 클릭
    const page2Button = page.locator('button[aria-label="페이지 2"]');
    await page2Button.click();

    // Then: 2페이지에 12개의 일기 카드가 표시됨
    await expect(diaryCards).toHaveCount(12);
    await expect(page.locator('[data-testid="diary-card-13"]')).toBeVisible();

    // When: 3페이지 버튼 클릭
    const page3Button = page.locator('button[aria-label="페이지 3"]');
    await page3Button.click();

    // Then: 3페이지에 1개의 일기 카드가 표시됨 (25개 중 마지막 1개)
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('[data-testid="diary-card-25"]')).toBeVisible();
  });

  test("검색 결과에 맞게 페이지 수가 변경되어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 다양한 제목의 일기 데이터 저장
    const testDiaries = [
      ...Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `행복한 일기 ${i + 1}`,
        content: `일기 내용 ${i + 1}`,
        emotion: EmotionType.Happy,
        createdAt: `2024-07-${String(12 + i).padStart(2, "0")}T08:57:49.537Z`,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        id: 16 + i,
        title: `슬픈 일기 ${i + 1}`,
        content: `일기 내용 ${i + 1}`,
        emotion: EmotionType.Sad,
        createdAt: `2024-07-${String(12 + i).padStart(2, "0")}T08:57:49.537Z`,
      })),
    ];

    // When: 목록 페이지로 이동하면서 로컬스토리지 데이터 설정
    await page.goto("/diaries");
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);
    await page.reload();

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 499,
    });

    // Then: 전체 일기 25개이므로 3페이지 (12, 12, 1)
    let pageButtons = page.locator('button[aria-label^="페이지"]');
    // 총 3페이지이므로 3개의 페이지 버튼이 표시됨
    const totalPages = Math.ceil(25 / 12); // 3페이지
    await expect(pageButtons).toHaveCount(Math.min(5, totalPages));

    // When: 검색창에 "행복"을 입력하고 엔터를 누름
    const searchInput = page.locator(
      '[data-testid="diary-search-input"] input'
    );
    await searchInput.fill("행복");
    await searchInput.press("Enter");

    // Then: 검색 결과 15개이므로 2페이지 (12, 3)
    const searchResultPages = Math.ceil(15 / 12); // 2페이지
    pageButtons = page.locator('button[aria-label^="페이지"]');
    await expect(pageButtons).toHaveCount(Math.min(5, searchResultPages));

    // Then: 첫 페이지에 12개의 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(12);
  });

  test("필터 결과에 맞게 페이지 수가 변경되어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 다양한 emotion 타입의 일기 데이터 저장
    const testDiaries = [
      ...Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `행복한 일기 ${i + 1}`,
        content: `일기 내용 ${i + 1}`,
        emotion: EmotionType.Happy,
        createdAt: `2024-07-${String(12 + i).padStart(2, "0")}T08:57:49.537Z`,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        id: 16 + i,
        title: `슬픈 일기 ${i + 1}`,
        content: `일기 내용 ${i + 1}`,
        emotion: EmotionType.Sad,
        createdAt: `2024-07-${String(12 + i).padStart(2, "0")}T08:57:49.537Z`,
      })),
    ];

    // When: 목록 페이지로 이동하면서 로컬스토리지 데이터 설정
    await page.goto("/diaries");
    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);
    await page.reload();

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 499,
    });

    // Then: 전체 일기 25개이므로 3페이지
    let pageButtons = page.locator('button[aria-label^="페이지"]');
    const totalPages = Math.ceil(25 / 12); // 3페이지
    await expect(pageButtons).toHaveCount(Math.min(5, totalPages));

    // When: 필터선택박스를 클릭하고 행복해요를 선택
    const filterSelectBox = page.locator(
      '[data-testid="diary-filter-selectbox"]'
    );
    await filterSelectBox.click();
    const happyOption = page.locator(
      '[data-testid="diary-filter-option-HAPPY"]'
    );
    await happyOption.click();

    // Then: 필터 결과 15개이므로 2페이지 (12, 3)
    const filterResultPages = Math.ceil(15 / 12); // 2페이지
    pageButtons = page.locator('button[aria-label^="페이지"]');
    await expect(pageButtons).toHaveCount(Math.min(5, filterResultPages));

    // Then: 첫 페이지에 12개의 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(12);
  });
});
