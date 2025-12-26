import { test, expect } from "@playwright/test";
import { EmotionType } from "@/commons/constants/enum";

/**
 * Diaries Detail Delete Hook 테스트
 *
 * 테스트 시나리오:
 * 1. /diaries/[id]에 접속하여 페이지 로드 확인
 * 2. 삭제 버튼 클릭
 * 3. 일기삭제 모달이 노출됨을 확인
 * 4. "취소" 클릭: 모달 닫기
 * 5. "삭제" 클릭: 해당 모달의 id와 일치하는 객체를 로컬스토리지의 diaries에서 제거 후 /diaries로 페이지 이동
 *
 * 테스트 대상:
 * - useDeleteHook Hook
 * - 로컬스토리지 데이터 삭제 (key: diaries)
 * - 다이나믹 라우팅 [id] 추출
 *
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용)
 * - 로컬스토리지 모킹 없음
 * - EmotionType enum 타입 사용
 */

test.describe("일기 삭제 기능", () => {
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
      createdAt: "2024-07-12T08:57:49.537Z",
    };

    // 로컬스토리지 데이터 설정
    await page.evaluate((diary) => {
      localStorage.setItem("diaries", JSON.stringify([diary]));
    }, testDiary);

    // 상세 페이지로 이동
    await page.goto("/diaries/1");

    // 페이지 로드 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      state: "visible",
    });
  });

  test("삭제 버튼을 클릭하면 삭제 모달이 노출되어야 한다", async ({ page }) => {
    // Given: 일기 상세 페이지가 로드됨
    await expect(page.locator('[data-testid="diary-title"]')).toBeVisible();

    // When: 삭제 버튼 클릭
    const deleteButton = page.locator("button:has-text('삭제')");
    await deleteButton.click();

    // Then: 삭제 모달이 노출되어야 함
    await expect(
      page.locator('[data-testid="diary-delete-modal"]')
    ).toBeVisible();

    // And: 모달 제목이 표시되어야 함
    await expect(
      page.locator('[data-testid="diary-delete-modal-title"]')
    ).toHaveText("일기 삭제");

    // And: 모달 설명이 표시되어야 함
    await expect(
      page.locator('[data-testid="diary-delete-modal-description"]')
    ).toHaveText("일기를 삭제 하시겠어요?");
  });

  test("삭제 모달에서 취소 버튼을 클릭하면 모달이 닫혀야 한다", async ({
    page,
  }) => {
    // Given: 삭제 모달이 열려있음
    const deleteButton = page.locator("button:has-text('삭제')");
    await deleteButton.click();
    await expect(
      page.locator('[data-testid="diary-delete-modal"]')
    ).toBeVisible();

    // When: 취소 버튼 클릭
    const cancelButton = page.locator(
      '[data-testid="diary-delete-modal-cancel-button"]'
    );
    await cancelButton.click();

    // Then: 모달이 닫혀야 함
    await expect(
      page.locator('[data-testid="diary-delete-modal"]')
    ).not.toBeVisible();

    // And: 일기 상세 페이지가 그대로 표시되어야 함
    await expect(page.locator('[data-testid="diary-title"]')).toBeVisible();
  });

  test("삭제 모달에서 삭제 버튼을 클릭하면 일기가 삭제되고 /diaries로 이동해야 한다", async ({
    page,
  }) => {
    // Given: 삭제 모달이 열려있음
    const deleteButton = page.locator("button:has-text('삭제')");
    await deleteButton.click();
    await expect(
      page.locator('[data-testid="diary-delete-modal"]')
    ).toBeVisible();

    // When: 삭제 버튼 클릭
    const confirmDeleteButton = page.locator(
      '[data-testid="diary-delete-modal-delete-button"]'
    );
    await confirmDeleteButton.click();

    // Then: /diaries 페이지로 이동해야 함
    await page.waitForURL("**/diaries");
    await expect(page).toHaveURL(/\/diaries$/);

    // And: 로컬스토리지에서 일기가 삭제되어야 함
    const diaries = await page.evaluate(() => {
      const diariesJson = localStorage.getItem("diaries");
      return diariesJson ? JSON.parse(diariesJson) : [];
    });

    expect(diaries).toHaveLength(0);
    expect(diaries.find((d: { id: number }) => d.id === 1)).toBeUndefined();
  });
});
