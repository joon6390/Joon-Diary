import { test, expect } from "@playwright/test";

/**
 * Diaries Link Modal Hook 테스트
 * 
 * 테스트 시나리오:
 * 일기쓰기 버튼 클릭시 모달을 열고, 모달을 통해 일기 작성 폼을 표시
 * 모달 닫기 기능 (닫기 버튼, 배경 클릭)
 * 
 * 테스트 대상:
 * - useLinkModal Hook
 * - Modal Provider 연동
 * - DiariesNew 컴포넌트 렌더링
 */

test.describe("일기쓰기 모달 기능 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // Given: /diaries 페이지로 이동
    await page.goto("/diaries");

    // And: 페이지 로드 완료를 data-testid로 확인
    await expect(page.locator('[data-testid="diaries-container"]')).toBeVisible();
  });

  test("일기쓰기 버튼이 표시되어야 한다", async ({ page }) => {
    // Then: 일기쓰기 버튼이 화면에 표시됨
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await expect(writeButton).toBeVisible();
    
    // And: 버튼에 "일기쓰기" 텍스트가 포함됨
    await expect(writeButton).toContainText("일기쓰기");
  });

  test("일기쓰기 버튼 클릭시 모달이 열려야 한다", async ({ page }) => {
    // When: 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // Then: 모달이 화면에 표시됨
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible();

    // And: 모달에 "일기 쓰기" 헤더가 표시됨
    await expect(modal.locator("text=일기 쓰기")).toBeVisible();
  });

  test("모달이 열렸을 때 배경(backdrop)이 표시되어야 한다", async ({ page }) => {
    // When: 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // Then: backdrop이 화면에 표시됨 (fixed inset-0 bg-black bg-opacity-50)
    const backdrop = page.locator(".fixed.inset-0.bg-black.bg-opacity-50");
    await expect(backdrop).toBeVisible();
  });

  test("모달이 페이지 중앙에 overlay되어야 한다", async ({ page }) => {
    // When: 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // Then: 모달 컨테이너가 중앙 정렬 스타일로 표시됨 (flex items-center justify-center)
    const modalContainer = page.locator(".fixed.inset-0.z-50.flex.items-center.justify-center");
    await expect(modalContainer).toBeVisible();

    // And: 모달 컨텐츠가 중앙에 위치함
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible();
  });

  test("모달의 닫기 버튼을 클릭하면 모달이 닫혀야 한다", async ({ page }) => {
    // Given: 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // And: 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible();

    // When: 닫기 버튼 클릭
    const closeButton = modal.locator("button", { hasText: "닫기" });
    await closeButton.click();

    // Then: 모달이 화면에서 사라짐
    await expect(modal).not.toBeVisible();
  });

  test("모달 배경(backdrop) 클릭시 모달이 닫혀야 한다", async ({ page }) => {
    // Given: 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // And: 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible();

    // When: backdrop 클릭 (모달 컨텐츠가 아닌 배경 영역)
    // 모달 컨테이너의 좌측 상단 모서리 클릭 (모달이 없는 영역)
    await page.locator(".fixed.inset-0.z-50.flex.items-center.justify-center").click({
      position: { x: 10, y: 10 }
    });

    // Then: 모달이 화면에서 사라짐
    await expect(modal).not.toBeVisible();
  });

  test("모달 내부에 일기 작성 폼 요소들이 표시되어야 한다", async ({ page }) => {
    // Given: 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // And: 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible();

    // Then: 감정 선택 질문이 표시됨
    await expect(modal.locator("text=오늘 기분은 어땠나요?")).toBeVisible();

    // And: 감정 라디오 버튼들이 표시됨
    await expect(modal.locator("text=행복해요")).toBeVisible();
    await expect(modal.locator("text=슬퍼요")).toBeVisible();
    await expect(modal.locator("text=화나요")).toBeVisible();
    await expect(modal.locator("text=놀랐어요")).toBeVisible();
    await expect(modal.locator("text=기타")).toBeVisible();

    // And: 제목 입력 필드가 표시됨
    await expect(modal.locator("label", { hasText: "제목" })).toBeVisible();
    await expect(modal.locator('input[placeholder="제목을 입력합니다."]')).toBeVisible();

    // And: 내용 입력 필드가 표시됨
    await expect(modal.locator("label", { hasText: "내용" })).toBeVisible();
    await expect(modal.locator('textarea[placeholder="내용을 입력합니다."]')).toBeVisible();

    // And: 등록하기 버튼이 표시됨
    await expect(modal.locator("button", { hasText: "등록하기" })).toBeVisible();
  });

  test("모달이 여러 번 열고 닫혀도 정상 작동해야 한다", async ({ page }) => {
    // Given: 첫 번째로 모달 열기
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // And: 모달이 열렸는지 확인
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible();

    // When: 닫기 버튼으로 모달 닫기
    const closeButton = modal.locator("button", { hasText: "닫기" });
    await closeButton.click();

    // Then: 모달이 닫힘
    await expect(modal).not.toBeVisible();

    // When: 두 번째로 모달 열기
    await writeButton.click();

    // Then: 모달이 다시 정상적으로 열림
    await expect(modal).toBeVisible();
    await expect(modal.locator("text=일기 쓰기")).toBeVisible();

    // When: 배경 클릭으로 모달 닫기
    await page.locator(".fixed.inset-0.z-50.flex.items-center.justify-center").click({
      position: { x: 10, y: 10 }
    });

    // Then: 모달이 닫힘
    await expect(modal).not.toBeVisible();

    // When: 세 번째로 모달 열기
    await writeButton.click();

    // Then: 모달이 여전히 정상적으로 작동함
    await expect(modal).toBeVisible();
  });
});

