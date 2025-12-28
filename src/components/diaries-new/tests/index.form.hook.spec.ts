import { test, expect } from "@playwright/test";

/**
 * Diaries New Form Hook 테스트
 * 
 * 테스트 시나리오:
 * 1. 모든 인풋이 입력되면 등록하기 버튼 활성화
 * 2. 등록하기 버튼 클릭시 API를 통해 저장
 * 3. 등록 완료시 등록완료모달 노출
 * 4. 등록완료모달의 확인 버튼 클릭시 상세페이지로 이동 및 모달 닫기
 * 
 * 테스트 대상:
 * - useFormHook Hook
 * - react-hook-form + zod 검증
 * - API를 통한 일기 생성
 * - Modal Provider 연동
 */

test.describe("일기쓰기 폼 등록 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 유저 설정 (일기쓰기 모달을 열기 위해 필요) - addInitScript 사용
    await page.addInitScript(() => {
      localStorage.setItem("accessToken", "test-token");
      localStorage.setItem("user", JSON.stringify({ _id: "test-user-123", name: "테스트 유저" }));
    });

    // API 모킹 설정
    await page.route("**/api/diaries", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ diaries: [] }),
        });
      } else if (route.request().method() === "POST") {
        const requestBody = await route.request().postDataJSON();
        const newDiary = {
          id: Date.now(),
          ...requestBody,
          createdAt: new Date().toISOString(),
        };
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(newDiary),
        });
      }
    });
    
    // 페이지 로드 대기
    await page.goto("/diaries");
    await expect(page.locator('[data-testid="diaries-container"]')).toBeVisible();
    
    // 일기쓰기 버튼 클릭
    await page.click('[data-testid="write-diary-button"]');
    
    // 일기쓰기 모달이 열렸는지 확인 (대기 시간 증가)
    await expect(page.locator('[data-testid="diary-modal"]')).toBeVisible({ timeout: 10000 });
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

  test("첫 일기를 등록하면 API를 통해 저장되어야 한다", async ({ page }) => {
    let capturedRequest: { emotion: string; title: string; content: string } | null = null;
    
    // API 요청 캡처
    await page.route("**/api/diaries", async (route) => {
      if (route.request().method() === "POST") {
        capturedRequest = await route.request().postDataJSON();
        const newDiary = {
          id: 1,
          ...capturedRequest,
          createdAt: new Date().toISOString(),
        };
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(newDiary),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ diaries: [] }),
        });
      }
    });

    // Given: 모든 필드 입력
    await page.click('input[name="emotion"][value="HAPPY"]');
    await page.fill('input[placeholder="제목을 입력합니다."]', "첫 번째 일기");
    await page.fill('textarea[placeholder="내용을 입력합니다."]', "첫 번째 내용");
    
    // When: 등록하기 버튼 클릭
    const submitButton = page.locator('[data-testid="diary-submit-button"]');
    await submitButton.click();
    
    // Then: API 요청이 올바르게 전송됨
    await page.waitForTimeout(500); // API 요청 완료 대기
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.title).toBe("첫 번째 일기");
    expect(capturedRequest.content).toBe("첫 번째 내용");
    expect(capturedRequest.emotion).toBe("HAPPY");
  });

  test("새 일기를 등록하면 API를 통해 저장되어야 한다", async ({ page }) => {
    let capturedRequest: { emotion: string; title: string; content: string } | null = null;
    
    // API 모킹 - 기존 일기 목록 반환
    await page.route("**/api/diaries", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            diaries: [
              {
                id: 1,
                title: "기존 일기 1",
                content: "기존 내용 1",
                emotion: "HAPPY",
                createdAt: new Date().toISOString(),
              },
              {
                id: 3,
                title: "기존 일기 2",
                content: "기존 내용 2",
                emotion: "SAD",
                createdAt: new Date().toISOString(),
              },
            ],
          }),
        });
      } else if (route.request().method() === "POST") {
        capturedRequest = await route.request().postDataJSON();
        const newDiary = {
          id: 4,
          ...capturedRequest,
          createdAt: new Date().toISOString(),
        };
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(newDiary),
        });
      }
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
    
    // Then: API 요청이 올바르게 전송됨
    await page.waitForTimeout(500);
    expect(capturedRequest).not.toBeNull();
    expect(capturedRequest.title).toBe("새 일기");
    expect(capturedRequest.content).toBe("새 내용");
    expect(capturedRequest.emotion).toBe("ANGRY");
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

  test("등록완료 후 상세페이지로 이동해야 한다", async ({ page }) => {
    let createdDiary: { id: number; title: string; content: string; emotion: string; createdAt: string } | null = null;
    
    // API 모킹
    await page.route("**/api/diaries*", async (route) => {
      if (route.request().method() === "POST") {
        const requestBody = await route.request().postDataJSON();
        createdDiary = {
          id: 123,
          ...requestBody,
          createdAt: new Date().toISOString(),
        };
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(createdDiary),
        });
      } else if (route.request().method() === "GET") {
        // 상세 페이지나 목록 페이지 모두 처리
        if (createdDiary) {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              diaries: [createdDiary],
            }),
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ diaries: [] }),
          });
        }
      }
    });

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
    
    // Then: URL에 일기 ID가 포함되어야 함
    const url = page.url();
    const diaryId = url.match(/\/diaries\/(\d+)/)?.[1];
    expect(diaryId).toBeDefined();
    expect(parseInt(diaryId!)).toBe(createdDiary?.id);
  });
});

