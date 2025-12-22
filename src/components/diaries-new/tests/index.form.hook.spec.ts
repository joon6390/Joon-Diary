import { test, expect } from "@playwright/test";

/**
 * Diaries New Form Hook 테스트
 * 
 * 테스트 시나리오:
 * 1. 모든 인풋이 입력되면 등록하기 버튼 활성화
 * 2. 등록하기 버튼 클릭시 로컬스토리지에 저장 (신규/추가)
 * 3. 등록 완료시 등록완료모달 노출
 * 4. 등록완료모달의 확인 버튼 클릭시 상세페이지로 이동 및 모달 닫기
 * 
 * 테스트 대상:
 * - useFormHook Hook
 * - react-hook-form + zod 검증
 * - 로컬스토리지 저장
 * - Modal Provider 연동
 */

test.describe("일기쓰기 폼 등록 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로컬스토리지 초기화
    await page.goto("/diaries");
    await page.evaluate(() => localStorage.clear());
    
    // 페이지 로드 대기
    await expect(page.locator('[data-testid="diaries-container"]')).toBeVisible();
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');
    
    // 일기쓰기 모달이 열렸는지 확인
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();
  });

  test("초기 상태에서 등록하기 버튼은 비활성화되어야 한다", async ({ page }) => {
    // Then: 등록하기 버튼이 비활성화 상태
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("감정만 선택한 경우 등록하기 버튼은 비활성화되어야 한다", async ({ page }) => {
    // When: 감정만 선택
    await page.click('input[name="emotion"][value="HAPPY"]');
    
    // Then: 등록하기 버튼이 여전히 비활성화
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("감정과 제목만 입력한 경우 등록하기 버튼은 비활성화되어야 한다", async ({ page }) => {
    // When: 감정 선택
    await page.click('input[name="emotion"][value="HAPPY"]');
    
    // And: 제목 입력
    await page.fill('input[placeholder="제목을 입력합니다."]', "테스트 제목");
    
    // Then: 등록하기 버튼이 여전히 비활성화
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("모든 필드를 입력하면 등록하기 버튼이 활성화되어야 한다", async ({ page }) => {
    // When: 감정 선택
    await page.click('input[name="emotion"][value="HAPPY"]');
    
    // And: 제목 입력
    await page.fill('input[placeholder="제목을 입력합니다."]', "테스트 제목");
    
    // And: 내용 입력
    await page.fill('textarea[placeholder="내용을 입력합니다."]', "테스트 내용");
    
    // Then: 등록하기 버튼이 활성화
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await expect(submitButton).toBeEnabled();
  });

  test("로컬스토리지가 비어있을 때 첫 일기를 등록하면 id는 1이어야 한다", async ({ page }) => {
    // Given: 모든 필드 입력
    await page.click('input[name="emotion"][value="HAPPY"]');
    await page.fill('input[placeholder="제목을 입력합니다."]', "첫 번째 일기");
    await page.fill('textarea[placeholder="내용을 입력합니다."]', "첫 번째 내용");
    
    // When: 등록하기 버튼 클릭
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await submitButton.click();
    
    // Then: 로컬스토리지에 id가 1인 데이터가 저장됨
    const diaries = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : null;
    });
    
    expect(diaries).not.toBeNull();
    expect(diaries).toHaveLength(1);
    expect(diaries[0].id).toBe(1);
    expect(diaries[0].title).toBe("첫 번째 일기");
    expect(diaries[0].content).toBe("첫 번째 내용");
    expect(diaries[0].emotion).toBe("HAPPY");
    expect(diaries[0].createdAt).toBeDefined();
  });

  test("로컬스토리지에 기존 일기가 있을 때 새 일기를 등록하면 id는 최대id+1이어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 기존 데이터 설정
    await page.evaluate(() => {
      const existingDiaries = [
        {
          id: 1,
          title: "기존 일기 1",
          content: "기존 내용 1",
          emotion: "HAPPY",
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: "기존 일기 2",
          content: "기존 내용 2",
          emotion: "SAD",
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('diaries', JSON.stringify(existingDiaries));
    });
    
    // 페이지 새로고침
    await page.reload();
    await expect(page.locator('[data-testid="diaries-container"]')).toBeVisible();
    await page.click('[data-testid="write-diary-button"]');
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible();
    
    // When: 새 일기 입력 및 등록
    await page.click('input[name="emotion"][value="ANGRY"]');
    await page.fill('input[placeholder="제목을 입력합니다."]', "새 일기");
    await page.fill('textarea[placeholder="내용을 입력합니다."]', "새 내용");
    
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await submitButton.click();
    
    // Then: 로컬스토리지에 id가 4(3+1)인 데이터가 추가됨
    const diaries = await page.evaluate(() => {
      const data = localStorage.getItem('diaries');
      return data ? JSON.parse(data) : null;
    });
    
    expect(diaries).toHaveLength(3);
    expect(diaries[2].id).toBe(4);
    expect(diaries[2].title).toBe("새 일기");
    expect(diaries[2].content).toBe("새 내용");
    expect(diaries[2].emotion).toBe("ANGRY");
  });

  test("등록 완료시 등록완료모달이 표시되어야 한다", async ({ page }) => {
    // Given: 모든 필드 입력
    await page.click('input[name="emotion"][value="SURPRISE"]');
    await page.fill('input[placeholder="제목을 입력합니다."]', "모달 테스트");
    await page.fill('textarea[placeholder="내용을 입력합니다."]', "모달 테스트 내용");
    
    // When: 등록하기 버튼 클릭
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await submitButton.click();
    
    // Then: 등록완료모달이 표시됨
    const successModal = page.locator('[data-testid="success-modal"]');
    await expect(successModal).toBeVisible();
    
    // And: 모달에 적절한 메시지가 표시됨
    await expect(successModal).toContainText("일기 등록 완료");
  });

  test("등록완료모달의 확인 버튼 클릭시 상세페이지로 이동하고 모든 모달이 닫혀야 한다", async ({ page }) => {
    // Given: 모든 필드 입력 및 등록
    await page.click('input[name="emotion"][value="ETC"]');
    await page.fill('input[placeholder="제목을 입력합니다."]', "상세페이지 이동 테스트");
    await page.fill('textarea[placeholder="내용을 입력합니다."]', "상세페이지 이동 내용");
    
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await submitButton.click();
    
    // And: 등록완료모달이 표시됨
    const successModal = page.locator('[data-testid="success-modal"]');
    await expect(successModal).toBeVisible();
    
    // When: 확인 버튼 클릭
    const confirmButton = successModal.locator('button').filter({ hasText: '확인' });
    await confirmButton.click();
    
    // Then: 상세페이지로 이동 (URL이 /diaries/1로 변경)
    await expect(page).toHaveURL(/\/diaries\/\d+/);
    
    // And: 모든 모달이 닫힘
    await expect(successModal).not.toBeVisible();
    await expect(page.locator('[data-testid="diary-modal"]')).not.toBeVisible();
  });

  test("등록완료 후 상세페이지에서 등록된 일기 내용을 확인할 수 있어야 한다", async ({ page }) => {
    // Given: 특정 내용으로 일기 등록
    const testTitle = "상세 확인 테스트";
    const testContent = "이 내용이 상세페이지에 표시되어야 합니다.";
    const testEmotion = "SAD";
    
    await page.click(`input[name="emotion"][value="${testEmotion}"]`);
    await page.fill('input[placeholder="제목을 입력합니다."]', testTitle);
    await page.fill('textarea[placeholder="내용을 입력합니다."]', testContent);
    
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await submitButton.click();
    
    // And: 등록완료모달의 확인 버튼 클릭
    const successModal = page.locator('[data-testid="success-modal"]');
    await expect(successModal).toBeVisible();
    
    const confirmButton = successModal.locator('button').filter({ hasText: '확인' });
    await confirmButton.click();
    
    // When: 상세페이지로 이동됨
    await expect(page).toHaveURL(/\/diaries\/\d+/);
    
    // Then: 등록한 일기 내용이 표시되어야 함 (상세페이지가 구현되어 있다고 가정)
    // 실제로는 상세페이지 구현에 따라 테스트가 달라질 수 있음
    // 현재는 URL 이동까지만 검증
    const url = page.url();
    const diaryId = url.match(/\/diaries\/(\d+)/)?.[1];
    expect(diaryId).toBeDefined();
    
    // 로컬스토리지에 해당 ID의 일기가 있는지 확인
    const diary = await page.evaluate((id) => {
      const data = localStorage.getItem('diaries');
      if (!data) return null;
      const diaries = JSON.parse(data) as Array<{ id: number; title: string; content: string; emotion: string; createdAt: string }>;
      return diaries.find((d) => d.id === parseInt(id));
    }, diaryId);
    
    expect(diary).not.toBeNull();
    expect(diary.title).toBe(testTitle);
    expect(diary.content).toBe(testContent);
    expect(diary.emotion).toBe(testEmotion);
  });
});

