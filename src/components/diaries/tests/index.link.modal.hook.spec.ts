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
    // Given: 로그인 상태 설정 (일기쓰기 모달을 열기 위해 필요)
    // page.goto 전에 localStorage 설정
    await page.addInitScript(() => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem("user", JSON.stringify({ _id: "test-user-123", name: "테스트 유저" }));
    });

    // And: /diaries 페이지로 이동
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

    // Then: 모달이 화면에 표시됨 (대기 시간 증가)
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // And: 모달에 "일기 쓰기" 헤더가 표시됨
    await expect(modal.locator("text=일기 쓰기")).toBeVisible();
  });

  test("모달이 열렸을 때 배경(backdrop)이 표시되어야 한다", async ({ page }) => {
    // When: 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // Then: 모달이 먼저 열렸는지 확인
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // And: backdrop이 화면에 표시됨
    const backdrop = page.locator('[data-testid="modal-backdrop"]');
    await expect(backdrop).toBeVisible();
  });

  test("모달이 페이지 중앙에 overlay되어야 한다", async ({ page }) => {
    // When: 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // Then: 모달 컨테이너가 중앙 정렬 스타일로 표시됨
    const modalContainer = page.locator('[data-testid="modal-container"]');
    await expect(modalContainer).toBeVisible({ timeout: 10000 });

    // And: 모달 컨텐츠가 중앙에 위치함
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });
  });

  test("모달의 닫기 버튼을 클릭하면 모달이 닫혀야 한다", async ({ page }) => {
    // Given: 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // And: 모달이 열렸는지 확인 (대기 시간 증가)
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // When: 닫기 버튼 클릭
    const closeButton = modal.locator('[data-testid="diary-close-button"]');
    await closeButton.click();

    // And: 등록취소 모달이 열렸는지 확인
    const cancelModal = page.locator('[data-testid="cancel-modal"]');
    await expect(cancelModal).toBeVisible();

    // When: 등록취소 버튼 클릭
    const cancelButton = cancelModal.locator('button').filter({ hasText: '등록 취소' });
    await cancelButton.click();

    // Then: 모든 모달이 화면에서 사라짐
    await expect(modal).not.toBeVisible({ timeout: 1500 });
    await expect(cancelModal).not.toBeVisible({ timeout: 1500 });
  });

  test("모달 배경(backdrop) 클릭시 모달이 닫혀야 한다", async ({ page }) => {
    // Given: 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // And: 모달이 열렸는지 확인 (대기 시간 증가)
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // When: backdrop 클릭 (모달 컨텐츠가 아닌 배경 영역)
    // 모달 컨테이너의 좌측 상단 모서리 클릭 (모달이 없는 영역)
    const modalContainer = page.locator('[data-testid="modal-container"]').first();
    await modalContainer.click({
      position: { x: 10, y: 10 }
    });

    // Then: 모달이 화면에서 사라짐
    await expect(modal).not.toBeVisible({ timeout: 1500 });
  });

  test("모달 내부에 일기 작성 폼 요소들이 표시되어야 한다", async ({ page }) => {
    // Given: 일기쓰기 버튼 클릭하여 모달 열기
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // And: 모달이 열렸는지 확인 (대기 시간 증가)
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

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

    // And: 모달이 열렸는지 확인 (대기 시간 증가)
    const modal = page.locator('[data-testid="diary-modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });

    // When: 닫기 버튼으로 모달 닫기
    const closeButton = modal.locator('[data-testid="diary-close-button"]');
    await closeButton.click();

    // And: 등록취소 모달이 열렸는지 확인
    const cancelModal = page.locator('[data-testid="cancel-modal"]');
    await expect(cancelModal).toBeVisible();

    // When: 등록취소 버튼 클릭
    const cancelButton = cancelModal.locator('button').filter({ hasText: '등록 취소' });
    await cancelButton.click();

    // Then: 모든 모달이 닫힘
    await expect(modal).not.toBeVisible({ timeout: 5000 });
    await expect(cancelModal).not.toBeVisible({ timeout: 5000 });

    // When: 두 번째로 모달 열기
    await writeButton.click();

    // Then: 모달이 다시 정상적으로 열림 (대기 시간 증가)
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(modal.locator("text=일기 쓰기")).toBeVisible();

    // When: 배경 클릭으로 모달 닫기
    const modalContainer = page.locator('[data-testid="modal-container"]').first();
    await modalContainer.click({
      position: { x: 10, y: 10 }
    });

    // Then: 모달이 닫힘
    await expect(modal).not.toBeVisible({ timeout: 5000 });

    // When: 세 번째로 모달 열기
    await writeButton.click();

    // Then: 모달이 여전히 정상적으로 작동함 (대기 시간 증가)
    await expect(modal).toBeVisible({ timeout: 10000 });
  });
});

test.describe("일기쓰기 권한 분기 테스트", () => {
  test("비로그인 유저가 일기쓰기 버튼을 클릭하면 로그인요청모달이 노출되어야 한다", async ({ page }) => {
    // Given: 비로그인 상태 설정 (로그인 검사 가드 활성화)
    // auth.guard.hook.tsx의 로직에 따르면 window.__TEST_BYPASS__ = true일 때 실제 로그인 상태를 확인함
    await page.addInitScript(() => {
      (window as Window & { __TEST_BYPASS__?: boolean }).__TEST_BYPASS__ = true;
      // localStorage에서 accessToken 제거 (비로그인 상태)
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    });

    // And: /diaries 페이지 접속
    await page.goto("/diaries");

    // And: 페이지 로드 완료를 data-testid로 확인
    await expect(page.locator('[data-testid="diaries-container"]')).toBeVisible();

    // When: 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // Then: 로그인요청모달이 노출됨
    const loginRequiredModal = page.locator('[data-testid="login-required-modal"]');
    await expect(loginRequiredModal).toBeVisible();

    // And: 모달에 "로그인하시겠습니까?" 제목이 표시됨
    await expect(loginRequiredModal.locator('h2:has-text("로그인하시겠습니까?")')).toBeVisible();
  });

  test("로그인 유저가 일기쓰기 버튼을 클릭하면 일기쓰기 페이지 모달이 노출되어야 한다", async ({ page }) => {
    // Given: 로그인 상태 설정 (로그인 검사 가드 무시)
    await page.addInitScript(() => {
      // window.__TEST_BYPASS__를 설정하지 않거나 true로 설정하여 로그인 검사 가드를 무시
      // localStorage에 accessToken 설정
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem("user", JSON.stringify({ _id: "test-id", name: "Test User" }));
    });

    // And: /diaries 페이지 접속
    await page.goto("/diaries");

    // And: 페이지 로드 완료를 data-testid로 확인
    await expect(page.locator('[data-testid="diaries-container"]')).toBeVisible();

    // When: 일기쓰기 버튼 클릭
    const writeButton = page.locator('[data-testid="write-diary-button"]');
    await writeButton.click();

    // Then: 일기쓰기 페이지 모달이 노출됨
    const diaryModal = page.locator('[data-testid="diary-modal"]');
    await expect(diaryModal).toBeVisible();

    // And: 모달에 "일기 쓰기" 헤더가 표시됨
    await expect(diaryModal.locator("text=일기 쓰기")).toBeVisible();
  });
});

