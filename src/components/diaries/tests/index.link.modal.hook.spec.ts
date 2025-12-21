import { test, expect } from "@playwright/test";

test.describe("일기쓰기 모달 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // /diaries 페이지로 이동
    await page.goto("/diaries");

    // 페이지 로드 완료를 data-testid로 확인
    await expect(page.locator('[data-testid="diaries-container"]')).toBeVisible();
  });

  test("일기쓰기 버튼이 표시되어야 한다", async ({ page }) => {
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await expect(writeButton).toBeVisible();
    await expect(writeButton).toContainText("일기쓰기");
  });

  test("일기쓰기 버튼 클릭시 모달이 열려야 한다", async ({ page }) => {
    // 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // 모달이 표시되는지 확인
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible();

    // 모달 내용 확인
    await expect(modal.locator("text=일기 쓰기")).toBeVisible();
  });

  test("모달이 열렸을 때 배경(backdrop)이 표시되어야 한다", async ({ page }) => {
    // 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // backdrop 확인 (fixed inset-0 bg-black bg-opacity-50 클래스를 가진 요소)
    const backdrop = page.locator(".fixed.inset-0.bg-black.bg-opacity-50");
    await expect(backdrop).toBeVisible();
  });

  test("모달이 페이지 중앙에 overlay되어야 한다", async ({ page }) => {
    // 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // 모달 컨테이너 확인 (flex items-center justify-center)
    const modalContainer = page.locator(".fixed.inset-0.z-50.flex.items-center.justify-center");
    await expect(modalContainer).toBeVisible();

    // 모달 컨텐츠가 중앙에 위치하는지 확인
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible();
  });

  test("모달의 닫기 버튼을 클릭하면 모달이 닫혀야 한다", async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible();

    // 닫기 버튼 클릭
    const closeButton = modal.locator("button", { hasText: "닫기" });
    await closeButton.click();

    // 모달이 사라졌는지 확인
    await expect(modal).not.toBeVisible();
  });

  test("모달 배경(backdrop) 클릭시 모달이 닫혀야 한다", async ({ page }) => {
    // 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible();

    // backdrop 클릭 (모달 컨테이너의 배경 영역)
    // 모달 컨테이너를 클릭하되, 모달 컨텐츠가 아닌 빈 공간을 클릭
    await page.locator(".fixed.inset-0.z-50.flex.items-center.justify-center").click({
      position: { x: 10, y: 10 } // 좌측 상단 모서리 클릭 (모달이 없는 영역)
    });

    // 모달이 사라졌는지 확인
    await expect(modal).not.toBeVisible();
  });
});

