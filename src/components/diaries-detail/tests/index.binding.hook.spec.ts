import { test, expect } from "@playwright/test";
import { EmotionType, getEmotionData } from "@/commons/constants/enum";

/**
 * Diaries Detail Binding Hook 테스트
 *
 * 테스트 시나리오:
 * 1. 로컬스토리지에 저장된 일기 데이터를 [id]로 조회하여 바인딩
 * 2. 제목, 감정아이콘/이미지, 감정텍스트, 작성일, 내용이 올바르게 표시되는지 확인
 * 3. 존재하지 않는 id로 접근 시 적절한 처리 확인
 *
 * 테스트 대상:
 * - useBindingHook Hook
 * - 로컬스토리지에서 diaries 배열 조회
 * - emotion enum 타입 활용
 *
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용)
 * - 로컬스토리지 모킹 없음
 */

test.describe("일기 상세 페이지 데이터 바인딩", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로컬스토리지 초기화
    await page.goto("/diaries");
    await page.evaluate(() => localStorage.clear());
  });

  test("로컬스토리지에 저장된 일기 데이터가 올바르게 바인딩되어야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 일기 데이터 저장 (ISO 날짜 형식 사용)
    const testDiary = {
      id: 1,
      title: "테스트 일기 제목",
      content: "테스트 일기 내용입니다.",
      emotion: EmotionType.Happy,
      createdAt: "2024-07-12T08:57:49.537Z",
    };

    await page.evaluate((diary) => {
      localStorage.setItem("diaries", JSON.stringify([diary]));
    }, testDiary);

    // When: 상세 페이지로 이동
    await page.goto("/diaries/1");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
    });

    // And: 제목이 올바르게 표시됨
    const title = page.locator('[data-testid="diary-title"]');
    await expect(title).toHaveText(testDiary.title);

    // And: 감정 텍스트가 올바르게 표시됨 (enum을 통해 참조한 실제 텍스트)
    const emotionText = page.locator('[data-testid="diary-emotion-text"]');
    await expect(emotionText).toBeVisible();
    await expect(emotionText).toHaveText(
      getEmotionData(testDiary.emotion).label
    );

    // And: 감정 아이콘이 표시됨
    const emotionIcon = page.locator('[data-testid="diary-emotion-icon"]');
    await expect(emotionIcon).toBeVisible();

    // And: 작성일이 올바르게 포맷되어 표시됨 (ISO 형식 → "YYYY. MM. DD" 형식)
    const dateText = page.locator('[data-testid="diary-date"]');
    await expect(dateText).toHaveText("2024. 07. 12");

    // And: 내용이 올바르게 표시됨
    const content = page.locator('[data-testid="diary-content"]');
    await expect(content).toHaveText(testDiary.content);
  });

  test("다양한 감정 타입의 일기가 올바르게 바인딩되어야 한다", async ({
    page,
  }) => {
    // Given: 다양한 감정 타입의 일기 데이터 저장 (ISO 날짜 형식 사용)
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

    for (const diary of testDiaries) {
      await page.evaluate((diaries) => {
        localStorage.setItem("diaries", JSON.stringify(diaries));
      }, testDiaries);

      // When: 각 일기 상세 페이지로 이동
      await page.goto(`/diaries/${diary.id}`);

      // Then: 페이지가 완전히 로드될 때까지 대기
      await page.waitForSelector('[data-testid="diaries-detail-container"]', {
        state: "visible",
      });

      // And: 제목이 올바르게 표시됨
      const title = page.locator('[data-testid="diary-title"]');
      await expect(title).toHaveText(diary.title);

      // And: 내용이 올바르게 표시됨
      const content = page.locator('[data-testid="diary-content"]');
      await expect(content).toHaveText(diary.content);

      // And: 작성일이 올바르게 포맷되어 표시됨 (ISO 형식 → "YYYY. MM. DD" 형식)
      const dateText = page.locator('[data-testid="diary-date"]');
      const expectedDate = new Date(diary.createdAt);
      const year = expectedDate.getFullYear();
      const month = String(expectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(expectedDate.getDate()).padStart(2, "0");
      await expect(dateText).toHaveText(`${year}. ${month}. ${day}`);

      // And: 감정 아이콘과 텍스트가 표시됨 (enum을 통해 참조한 실제 텍스트)
      const emotionIcon = page.locator('[data-testid="diary-emotion-icon"]');
      const emotionText = page.locator('[data-testid="diary-emotion-text"]');
      await expect(emotionIcon).toBeVisible();
      await expect(emotionText).toBeVisible();
      await expect(emotionText).toHaveText(getEmotionData(diary.emotion).label);
    }
  });

  test("존재하지 않는 id로 접근 시 적절히 처리되어야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지에 다른 id의 일기만 저장
    const testDiary = {
      id: 1,
      title: "첫 번째 일기",
      content: "내용",
      emotion: EmotionType.Happy,
      createdAt: "2024-07-12T08:57:49.537Z",
    };

    await page.evaluate((diary) => {
      localStorage.setItem("diaries", JSON.stringify([diary]));
    }, testDiary);

    // When: 존재하지 않는 id로 상세 페이지 접근
    await page.goto("/diaries/999");

    // Then: 페이지가 로드되지만 데이터가 없거나 기본값이 표시됨
    // (구현에 따라 다를 수 있으나, 최소한 에러가 발생하지 않아야 함)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 499,
    });
  });

  test("로컬스토리지가 비어있을 때도 에러가 발생하지 않아야 한다", async ({
    page,
  }) => {
    // Given: 로컬스토리지가 비어있음
    await page.evaluate(() => {
      localStorage.clear();
    });

    // When: 상세 페이지로 이동
    await page.goto("/diaries/1");

    // Then: 페이지가 로드되지만 데이터가 없거나 기본값이 표시됨
    // (구현에 따라 다를 수 있으나, 최소한 에러가 발생하지 않아야 함)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 499,
    });
  });
});
