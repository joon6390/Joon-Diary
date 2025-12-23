import { test, expect } from "@playwright/test";
import { EmotionType, getEmotionData } from "@/commons/constants/enum";

/**
 * Diaries Binding Hook 테스트
 * 
 * 테스트 시나리오:
 * 1. 로컬스토리지에 저장된 일기 데이터들을 가져와서 카드로 표시
 * 2. 각 카드의 감정 이미지, 감정 텍스트, 작성일, 제목이 올바르게 바인딩되는지 확인
 * 3. 제목이 길면 "..." 처리되어 표시되는지 확인
 * 4. 다양한 감정 타입의 일기들이 올바르게 바인딩되는지 확인
 * 
 * 테스트 대상:
 * - useBindingHook Hook
 * - 로컬스토리지에서 diaries 배열 조회
 * - emotion enum 타입 활용
 * - 날짜 포맷팅
 * - 제목 말줄임 처리
 * 
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용)
 * - 로컬스토리지 모킹 없음
 */

/**
 * ISO 날짜 문자열을 "YYYY. MM. DD" 형식으로 변환
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}`;
};

test.describe("일기 목록 페이지 데이터 바인딩", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로컬스토리지 초기화
    await page.goto("/diaries");
    await page.evaluate(() => localStorage.clear());
  });

  test("로컬스토리지에 저장된 일기 데이터들이 올바르게 바인딩되어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 일기 데이터 저장
    const testDiaries = [
      {
        id: 1,
        title: "테스트 일기 제목",
        content: "테스트 일기 내용입니다.",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "두 번째 일기",
        content: "두 번째 일기 내용입니다.",
        emotion: EmotionType.Sad,
        createdAt: "2024-07-13T08:57:49.537Z",
      },
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 499,
    });

    // And: 일기 카드들이 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(2);

    // And: 첫 번째 일기 카드의 데이터가 올바르게 바인딩됨
    const firstCard = page.locator('[data-testid="diary-card-1"]');
    await expect(firstCard).toBeVisible();

    // 감정 텍스트 확인
    const firstEmotionText = firstCard.locator('[data-testid="diary-emotion-text"]');
    await expect(firstEmotionText).toHaveText(getEmotionData(testDiaries[0].emotion).label);

    // 작성일 확인
    const firstDateText = firstCard.locator('[data-testid="diary-date"]');
    await expect(firstDateText).toHaveText(formatDate(testDiaries[0].createdAt));

    // 제목 확인
    const firstTitle = firstCard.locator('[data-testid="diary-title"]');
    await expect(firstTitle).toHaveText(testDiaries[0].title);

    // 감정 이미지 확인
    const firstEmotionImage = firstCard.locator('[data-testid="diary-emotion-image"]');
    await expect(firstEmotionImage).toBeVisible();

    // And: 두 번째 일기 카드의 데이터가 올바르게 바인딩됨
    const secondCard = page.locator('[data-testid="diary-card-2"]');
    await expect(secondCard).toBeVisible();

    // 감정 텍스트 확인
    const secondEmotionText = secondCard.locator('[data-testid="diary-emotion-text"]');
    await expect(secondEmotionText).toHaveText(getEmotionData(testDiaries[1].emotion).label);

    // 작성일 확인
    const secondDateText = secondCard.locator('[data-testid="diary-date"]');
    await expect(secondDateText).toHaveText(formatDate(testDiaries[1].createdAt));

    // 제목 확인
    const secondTitle = secondCard.locator('[data-testid="diary-title"]');
    await expect(secondTitle).toHaveText(testDiaries[1].title);
  });

  test("다양한 감정 타입의 일기들이 올바르게 바인딩되어야 한다", async ({ page }) => {
    // Given: 다양한 감정 타입의 일기 데이터 저장
    const testDiaries = [
      {
        id: 1,
        title: "행복한 일기",
        content: "행복한 내용",
        emotion: EmotionType.Happy,
        createdAt: "2024-07-12T08:57:49.537Z",
      },
      {
        id: 2,
        title: "슬픈 일기",
        content: "슬픈 내용",
        emotion: EmotionType.Sad,
        createdAt: "2024-07-13T08:57:49.537Z",
      },
      {
        id: 3,
        title: "화난 일기",
        content: "화난 내용",
        emotion: EmotionType.Angry,
        createdAt: "2024-07-14T08:57:49.537Z",
      },
      {
        id: 4,
        title: "놀란 일기",
        content: "놀란 내용",
        emotion: EmotionType.Surprise,
        createdAt: "2024-07-15T08:57:49.537Z",
      },
      {
        id: 5,
        title: "기타 일기",
        content: "기타 내용",
        emotion: EmotionType.Etc,
        createdAt: "2024-07-16T08:57:49.537Z",
      },
    ];

    await page.evaluate((diaries) => {
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }, testDiaries);

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 499,
    });

    // And: 모든 일기 카드가 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    await expect(diaryCards).toHaveCount(5);

    // And: 각 일기 카드의 감정 텍스트가 올바르게 표시됨
    for (const diary of testDiaries) {
      const card = page.locator(`[data-testid="diary-card-${diary.id}"]`);
      await expect(card).toBeVisible();

      const emotionText = card.locator('[data-testid="diary-emotion-text"]');
      await expect(emotionText).toHaveText(getEmotionData(diary.emotion).label);

      const dateText = card.locator('[data-testid="diary-date"]');
      await expect(dateText).toHaveText(formatDate(diary.createdAt));

      const title = card.locator('[data-testid="diary-title"]');
      await expect(title).toHaveText(diary.title);
    }
  });

  test("제목이 길면 말줄임 처리되어 표시되어야 한다", async ({ page }) => {
    // Given: 긴 제목을 가진 일기 데이터 저장
    const longTitle = "이것은 매우 긴 제목입니다. 이 제목은 일기 카드의 너비를 넘어서게 되어 말줄임 처리가 되어야 합니다. 이렇게 긴 제목이 제대로 처리되는지 확인합니다.";
    const testDiary = {
      id: 1,
      title: longTitle,
      content: "내용",
      emotion: EmotionType.Happy,
      createdAt: "2024-07-12T08:57:49.537Z",
    };

    await page.evaluate((diary) => {
      localStorage.setItem("diaries", JSON.stringify([diary]));
    }, testDiary);

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 499,
    });

    // And: 일기 카드가 표시됨
    const card = page.locator('[data-testid="diary-card-1"]');
    await expect(card).toBeVisible();

    // And: 제목이 표시됨
    const title = card.locator('[data-testid="diary-title"]');
    await expect(title).toBeVisible();
    
    // And: 제목의 원본 텍스트가 올바르게 바인딩됨
    // (CSS text-overflow: ellipsis가 시각적으로 말줄임 처리하지만, DOM에는 전체 텍스트가 유지됨)
    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText).toBe(longTitle);
    
    // And: CSS 스타일이 말줄임 처리를 위한 스타일을 가지고 있는지 확인
    const titleElement = title.first();
    const overflow = await titleElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        overflow: styles.overflow,
        textOverflow: styles.textOverflow,
        whiteSpace: styles.whiteSpace,
      };
    });
    expect(overflow.textOverflow).toBe("ellipsis");
    expect(overflow.whiteSpace).toBe("nowrap");
    expect(["hidden", "clip"]).toContain(overflow.overflow);
  });

  test("로컬스토리지가 비어있을 때도 에러가 발생하지 않아야 한다", async ({ page }) => {
    // Given: 로컬스토리지가 비어있음
    await page.evaluate(() => {
      localStorage.clear();
    });

    // When: 목록 페이지로 이동
    await page.goto("/diaries");

    // Then: 페이지가 로드되며 에러가 발생하지 않음
    await page.waitForSelector('[data-testid="diaries-container"]', {
      timeout: 499,
    });

    // And: 일기 카드가 없거나 빈 상태로 표시됨
    const diaryCards = page.locator('[data-testid^="diary-card-"]');
    const count = await diaryCards.count();
    expect(count).toBe(0);
  });
});

