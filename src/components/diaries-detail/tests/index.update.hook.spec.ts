import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

/**
 * Diaries Detail Update Hook 테스트
 *
 * 테스트 시나리오:
 * 1. /diaries/[id]에 접속하여 페이지 로드 확인
 * 2. 일기상세에서 수정 버튼을 클릭
 * 3. 일기상세 내용이 제공된 피그마의 (수정전)에서 (수정중)으로 변경되었음을 확인
 * 4. (수정중) 상황에서 회고입력창에 입력 불가능함을 확인
 * 5. (수정중) 상황에서 수정화면의 emotion, title, content를 변경 후, 수정하기 버튼을 클릭
 * 6. 수정이 완료되고, (수정전) 디자인 화면으로 돌아가서, 리프레시 되었음을 확인
 *
 * 테스트 대상:
 * - useUpdateHook Hook
 * - API를 통한 데이터 업데이트
 * - 다이나믹 라우팅 [id] 추출
 *
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - API 모킹 사용
 * - EmotionType enum 타입 사용
 */

test.describe("일기 수정 기능", () => {
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

    let updatedDiary = { ...testDiary };

    // API 모킹
    await page.route("**/api/diaries*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ diaries: [updatedDiary] }),
        });
      } else if (route.request().method() === "PUT") {
        const requestBody = await route.request().postDataJSON();
        updatedDiary = { ...updatedDiary, ...requestBody };
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(updatedDiary),
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

  test("수정 버튼을 클릭하면 수정 모드로 전환되어야 한다", async ({
    page,
  }) => {
    // Given: 일기 상세 페이지가 로드됨
    await expect(page.locator('[data-testid="diary-title"]')).toBeVisible();

    // When: 수정 버튼 클릭
    const editButton = page.locator("button:has-text('수정')");
    await editButton.click();

    // Then: 수정 모드로 전환되어야 함 (감정 선택 영역이 나타나야 함)
    await expect(
      page.locator('[data-testid="diary-update-emotion-section"]')
    ).toBeVisible();

    // And: 제목 입력 필드가 나타나야 함
    await expect(
      page.locator('[data-testid="diary-update-title-input"]')
    ).toBeVisible();

    // And: 내용 입력 필드가 나타나야 함
    await expect(
      page.locator('[data-testid="diary-update-content-textarea"]')
    ).toBeVisible();
  });

  test("수정 중일 때 회고 입력창이 비활성화되어야 한다", async ({
    page,
  }) => {
    // Given: 수정 모드로 전환
    const editButton = page.locator("button:has-text('수정')");
    await editButton.click();

    // Then: 회고 입력 필드가 비활성화되어야 함
    const retrospectInput = page.locator('[data-testid="retrospect-input"]');
    await expect(retrospectInput).toBeDisabled();

    // And: 회고 제출 버튼이 비활성화되어야 함
    const retrospectSubmitButton = page.locator(
      '[data-testid="retrospect-submit-button"]'
    );
    await expect(retrospectSubmitButton).toBeDisabled();
  });

  test("수정 화면에서 emotion, title, content를 변경하고 수정하기 버튼을 클릭하면 일기가 수정되어야 한다", async ({
    page,
  }) => {
    // Given: 수정 모드로 전환
    const editButton = page.locator("button:has-text('수정')");
    await editButton.click();

    // When: 감정을 Sad로 변경
    const sadRadio = page.locator(
      `[data-testid="diary-update-emotion-radio-${EmotionType.Sad}"]`
    );
    await sadRadio.click();

    // And: 제목을 변경
    const titleInput = page.locator('[data-testid="diary-update-title-input"]');
    await titleInput.clear();
    await titleInput.fill("수정된 제목");

    // And: 내용을 변경
    const contentTextarea = page.locator(
      '[data-testid="diary-update-content-textarea"]'
    );
    await contentTextarea.clear();
    await contentTextarea.fill("수정된 내용");

    // And: 수정하기 버튼 클릭
    const submitButton = page.locator("button:has-text('수정 하기')");
    await submitButton.click();

    // Then: 페이지가 리로드되고 완전히 로드될 때까지 대기
    await page.waitForLoadState("networkidle");
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 5000,
    });

    // And: 수정 모드가 종료되고 상세 화면으로 돌아가야 함
    await expect(
      page.locator('[data-testid="diary-update-emotion-section"]')
    ).not.toBeVisible();

    // And: 수정된 제목이 표시되어야 함
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText(
      "수정된 제목"
    );

    // And: 수정된 내용이 표시되어야 함
    await expect(page.locator('[data-testid="diary-content"]')).toHaveText(
      "수정된 내용"
    );

    // And: 수정된 감정이 표시되어야 함
    await expect(
      page.locator('[data-testid="diary-emotion-text"]')
    ).toHaveText("슬퍼요");

    // And: 수정된 내용이 표시되어야 함 (API를 통해 업데이트됨)
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText(
      "수정된 제목"
    );
    await expect(page.locator('[data-testid="diary-content"]')).toHaveText(
      "수정된 내용"
    );
  });

  test("수정 중 취소 버튼을 클릭하면 수정 모드가 종료되어야 한다", async ({
    page,
  }) => {
    // Given: 수정 모드로 전환
    const editButton = page.locator("button:has-text('수정')");
    await editButton.click();

    // When: 취소 버튼 클릭
    const cancelButton = page.locator("button:has-text('취소')");
    await cancelButton.click();

    // Then: 수정 모드가 종료되고 상세 화면으로 돌아가야 함
    await expect(
      page.locator('[data-testid="diary-update-emotion-section"]')
    ).not.toBeVisible();

    // And: 원본 데이터가 그대로 표시되어야 함
    await expect(page.locator('[data-testid="diary-title"]')).toHaveText(
      "테스트 일기"
    );
  });
});

