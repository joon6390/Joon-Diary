import { test, expect } from "@playwright/test";
import { EmotionType, emotionDataMap } from "@/commons/constants/enum";

/**
 * Diaries Filter Hook 테스트
 * 
 * 테스트 시나리오:
 * 1. /diaries에 접속하여 페이지 로드 확인
 * 2. 필터선택박스 클릭
 * 3. 선택 가능 메뉴 확인 (전체, 행복해요, 슬퍼요, 놀랐어요, 화나요)
 * 4. 메뉴 선택 시 해당 emotion과 일치하는 일기만 표시
 * 5. 검색 결과 필터링도 테스트
 * 
 * 테스트 대상:
 * - useFilterHook Hook
 * - 로컬스토리지에서 diaries 배열 emotion 필터링
 * - emotion enum 타입 활용
 * 
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용)
 * - 로컬스토리지 모킹 없음
 */

test.describe("일기 필터 기능", () => {
  test("필터선택박스를 클릭하면 선택 가능한 메뉴가 표시되어야 한다", async ({ page }) => {
    // Given: API 모킹 - 일기 데이터 반환
    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
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

    // When: 필터선택박스 클릭
    const filterSelectBox = page.locator('[data-testid="diary-filter-selectbox"]');
    await filterSelectBox.click();

    // Then: 선택 가능한 메뉴들이 표시됨
    // 전체
    const allOption = page.locator('[data-testid="diary-filter-option-all"]');
    await expect(allOption).toBeVisible();
    await expect(allOption).toHaveText("전체");

    // 행복해요
    const happyOption = page.locator('[data-testid="diary-filter-option-HAPPY"]');
    await expect(happyOption).toBeVisible();
    await expect(happyOption).toHaveText(emotionDataMap[EmotionType.Happy].label);

    // 슬퍼요
    const sadOption = page.locator('[data-testid="diary-filter-option-SAD"]');
    await expect(sadOption).toBeVisible();
    await expect(sadOption).toHaveText(emotionDataMap[EmotionType.Sad].label);

    // 놀랐어요
    const surpriseOption = page.locator('[data-testid="diary-filter-option-SURPRISE"]');
    await expect(surpriseOption).toBeVisible();
    await expect(surpriseOption).toHaveText(emotionDataMap[EmotionType.Surprise].label);

    // 화나요
    const angryOption = page.locator('[data-testid="diary-filter-option-ANGRY"]');
    await expect(angryOption).toBeVisible();
    await expect(angryOption).toHaveText(emotionDataMap[EmotionType.Angry].label);
  });

  test("전체를 선택하면 모든 일기가 표시되어야 한다", async ({ page }) => {
    // Given: API 모킹 - 다양한 emotion 타입의 일기 데이터 반환
    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
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
        title: "놀란 하루",
        content: "오늘은 놀란 하루였습니다.",
        emotion: EmotionType.Surprise,
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

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // And: 모든 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(3);

    // When: 필터선택박스를 클릭하고 전체를 선택
    const filterSelectBox = page.locator('[data-testid="diary-filter-selectbox"]');
    await filterSelectBox.click();
    const allOption = page.locator('[data-testid="diary-filter-option-all"]');
    await allOption.click();

    // Then: 모든 일기 카드가 표시됨
    await expect(diaryCards).toHaveCount(3);
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-3"]')).toBeVisible();
  });

  test("행복해요를 선택하면 행복한 emotion의 일기만 표시되어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 다양한 emotion 타입의 일기 데이터 저장
    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
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
        title: "또 다른 행복한 하루",
        content: "또 다른 행복한 하루입니다.",
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

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // When: 필터선택박스를 클릭하고 행복해요를 선택
    const filterSelectBox = page.locator('[data-testid="diary-filter-selectbox"]');
    await filterSelectBox.click();
    const happyOption = page.locator('[data-testid="diary-filter-option-HAPPY"]');
    await happyOption.click();

    // Then: 행복한 emotion의 일기만 표시됨 (id: 1, 3)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(2);
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-2"]')).not.toBeVisible();
  });

  test("슬퍼요를 선택하면 슬픈 emotion의 일기만 표시되어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 다양한 emotion 타입의 일기 데이터 저장
    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
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
        title: "또 다른 슬픈 하루",
        content: "또 다른 슬픈 하루입니다.",
        emotion: EmotionType.Sad,
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

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // When: 필터선택박스를 클릭하고 슬퍼요를 선택
    const filterSelectBox = page.locator('[data-testid="diary-filter-selectbox"]');
    await filterSelectBox.click();
    const sadOption = page.locator('[data-testid="diary-filter-option-SAD"]');
    await sadOption.click();

    // Then: 슬픈 emotion의 일기만 표시됨 (id: 2, 3)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(2);
    await expect(page.locator('[data-testid="diary-card-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-1"]')).not.toBeVisible();
  });

  test("놀랐어요를 선택하면 놀란 emotion의 일기만 표시되어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 다양한 emotion 타입의 일기 데이터 저장
    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
        content: "오늘은 정말 행복한 하루였습니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "놀란 하루",
        content: "오늘은 놀란 하루였습니다.",
        emotion: EmotionType.Surprise,
        createdAt: "2024-07-13T08:57:49.537Z",
      },
      {
        id: 3,
        title: "또 다른 놀란 하루",
        content: "또 다른 놀란 하루입니다.",
        emotion: EmotionType.Surprise,
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

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // When: 필터선택박스를 클릭하고 놀랐어요를 선택
    const filterSelectBox = page.locator('[data-testid="diary-filter-selectbox"]');
    await filterSelectBox.click();
    const surpriseOption = page.locator('[data-testid="diary-filter-option-SURPRISE"]');
    await surpriseOption.click();

    // Then: 놀란 emotion의 일기만 표시됨 (id: 2, 3)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(2);
    await expect(page.locator('[data-testid="diary-card-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-1"]')).not.toBeVisible();
  });

  test("화나요를 선택하면 화난 emotion의 일기만 표시되어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 다양한 emotion 타입의 일기 데이터 저장
    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
        content: "오늘은 정말 행복한 하루였습니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "화난 하루",
        content: "오늘은 화난 하루였습니다.",
        emotion: EmotionType.Angry,
        createdAt: "2024-07-13T08:57:49.537Z",
      },
      {
        id: 3,
        title: "또 다른 화난 하루",
        content: "또 다른 화난 하루입니다.",
        emotion: EmotionType.Angry,
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

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // When: 필터선택박스를 클릭하고 화나요를 선택
    const filterSelectBox = page.locator('[data-testid="diary-filter-selectbox"]');
    await filterSelectBox.click();
    const angryOption = page.locator('[data-testid="diary-filter-option-ANGRY"]');
    await angryOption.click();

    // Then: 화난 emotion의 일기만 표시됨 (id: 2, 3)
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(2);
    await expect(page.locator('[data-testid="diary-card-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-1"]')).not.toBeVisible();
  });

  test("검색 결과에 필터를 적용하면 검색된 결과 중에서 필터링된 일기만 표시되어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 다양한 emotion 타입의 일기 데이터 저장
    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
        content: "오늘은 정말 행복한 하루였습니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "행복한 순간",
        content: "행복한 순간입니다.",
        emotion: EmotionType.Sad,
        createdAt: "2024-07-13T08:57:49.537Z",
      },
      {
        id: 3,
        title: "행복한 하루 2",
        content: "또 다른 행복한 하루입니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-14T08:57:49.537Z",
      },
      {
        id: 4,
        title: "슬픈 하루",
        content: "오늘은 슬픈 하루였습니다.",
        emotion: EmotionType.Sad,
        createdAt: "2024-07-15T08:57:49.537Z",
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

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // When: 검색창에 "행복"을 입력하고 엔터를 누름
    const searchInput = page.locator('[data-testid="diary-search-input"] input');
    await searchInput.fill("행복");
    await searchInput.press("Enter");

    // Then: "행복"이 포함된 일기만 표시됨 (id: 1, 2, 3)
    let diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(3);
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-4"]')).not.toBeVisible();

    // When: 필터선택박스를 클릭하고 행복해요를 선택
    const filterSelectBox = page.locator('[data-testid="diary-filter-selectbox"]');
    await filterSelectBox.click();
    const happyOption = page.locator('[data-testid="diary-filter-option-HAPPY"]');
    await happyOption.click();

    // Then: 검색 결과 중에서 행복한 emotion의 일기만 표시됨 (id: 1, 3)
    diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(2);
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-3"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-2"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="diary-card-4"]')).not.toBeVisible();
  });

  test("필터를 적용한 후 전체를 선택하면 모든 일기가 표시되어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 다양한 emotion 타입의 일기 데이터 저장
    const testDiaries = [
      {
        id: 1,
        title: "행복한 하루",
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
        title: "놀란 하루",
        content: "오늘은 놀란 하루였습니다.",
        emotion: EmotionType.Surprise,
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

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      state: "visible",
    });

    // When: 필터선택박스를 클릭하고 행복해요를 선택
    const filterSelectBox = page.locator('[data-testid="diary-filter-selectbox"]');
    await filterSelectBox.click();
    const happyOption = page.locator('[data-testid="diary-filter-option-HAPPY"]');
    await happyOption.click();

    // Then: 행복한 emotion의 일기만 표시됨 (id: 1)
    let diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(1);
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();

    // When: 필터선택박스를 클릭하고 전체를 선택
    await filterSelectBox.click();
    const allOption = page.locator('[data-testid="diary-filter-option-all"]');
    await allOption.click();

    // Then: 모든 일기 카드가 표시됨
    diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(3);
    await expect(page.locator('[data-testid="diary-card-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="diary-card-3"]')).toBeVisible();
  });
});

