import { test, expect } from "@playwright/test";

/**
 * Diaries New Link Modal Close Hook 테스트
 * 
 * 테스트 시나리오:
 * 1. 닫기 버튼 클릭 시 등록취소모달이 열림
 * 2. 계속작성 버튼 클릭 시 등록취소모달만 닫힘 (일기쓰기폼모달은 유지)
 * 3. 등록취소 버튼 클릭 시 두 모달 모두 닫힘
 * 
 * 테스트 대상:
 * - useLinkModalClose Hook
 * - Modal Provider 2중 모달 연동
 * - 등록취소모달 컴포넌트
 */

test.describe("일기쓰기 모달 닫기 기능", () => {
  test("닫기 버튼 클릭 시 등록취소모달이 열리고, 계속작성 버튼으로 등록취소모달만 닫힘", async ({
    page,
  }) => {
    // /diaries 페이지로 이동
    await page.goto("/diaries");

    // 페이지 로드 대기 (data-testid 사용)
    await expect(
      page.locator('[data-testid="diaries-container"]')
    ).toBeVisible();

    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');

    // 일기쓰기폼모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();

    // 닫기 버튼 클릭
    await page.click('[data-testid="diary-close-button"]');

    // 등록취소모달이 열렸는지 확인
    await expect(page.locator('[data-testid="cancel-modal"]')).toBeVisible();

    // 계속작성 버튼 클릭
    const continueButton = page
      .locator('[data-testid="cancel-modal"]')
      .locator('button')
      .filter({ hasText: '계속작성' });
    await continueButton.click();

    // 등록취소모달이 닫혔는지 확인
    await expect(
      page.locator('[data-testid="cancel-modal"]')
    ).not.toBeVisible();

    // 일기쓰기폼모달은 여전히 열려있는지 확인
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();
  });

  test("닫기 버튼 클릭 시 등록취소모달이 열리고, 등록취소 버튼으로 두 모달 모두 닫힘", async ({
    page,
  }) => {
    // /diaries 페이지로 이동
    await page.goto("/diaries");

    // 페이지 로드 대기 (data-testid 사용)
    await expect(
      page.locator('[data-testid="diaries-container"]')
    ).toBeVisible();

    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');

    // 일기쓰기폼모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();

    // 닫기 버튼 클릭
    await page.click('[data-testid="diary-close-button"]');

    // 등록취소모달이 열렸는지 확인
    await expect(page.locator('[data-testid="cancel-modal"]')).toBeVisible();

    // 등록취소 버튼 클릭
    const cancelButton = page
      .locator('[data-testid="cancel-modal"]')
      .locator('button')
      .filter({ hasText: '등록취소' });
    await cancelButton.click();

    // 등록취소모달이 닫혔는지 확인
    await expect(
      page.locator('[data-testid="cancel-modal"]')
    ).not.toBeVisible();

    // 일기쓰기폼모달도 닫혔는지 확인
    await expect(page.locator('[data-testid="diary-modal"]')).not.toBeVisible();
  });
});

