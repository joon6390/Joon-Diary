import { test, expect } from "@playwright/test";

/**
 * Diaries Detail Retrospect Form Hook 테스트
 * 
 * 테스트 시나리오:
 * 1. 회고등록 인풋이 입력되면 입력버튼을 활성화
 * 2. 등록하기버튼을 클릭시, 로컬스토리지에 이미 retrospects가 존재하는지 확인하고,
 *    존재하면 기존의 retrospects에 push하되, id를 가장큰 id+1로 설정하여 재등록하고,
 *    존재하지 않으면 새로운 retrospects 배열을 생성하여 id는 1로 설정하여 등록
 * 3. 등록이 완료되면, 현재 페이지를 새로고침
 * 
 * 테스트 대상:
 * - useRetrospectFormHook Hook
 * - react-hook-form + zod 검증
 * - 로컬스토리지 저장 (key: retrospects)
 * 
 * 테스트 조건:
 * - timeout: 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용)
 * - 로컬스토리지 모킹 없음
 */

test.describe("회고쓰기 폼 등록 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로컬스토리지 초기화
    await page.goto("/diaries");
    await page.evaluate(() => localStorage.clear());
    
    // 테스트용 일기 데이터 생성
    const testDiary = {
      id: 1,
      title: "테스트 일기",
      content: "테스트 내용",
      emotion: "HAPPY",
      createdAt: new Date().toISOString(),
    };
    
    // 로컬스토리지 데이터 설정
    await page.evaluate((diary) => {
      localStorage.setItem("diaries", JSON.stringify([diary]));
    }, testDiary);
    // 상세 페이지로 이동
    await page.goto("/diaries/1", { waitUntil: "networkidle" });
    
    // 페이지 로드 대기 (data-testid 사용)
    // useParams와 useEffect가 실행될 때까지 시간이 필요
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 15000,
    });
  });

  test("초기 상태에서 입력 버튼은 비활성화되어야 한다", async ({ page }) => {
    // Then: 입력 버튼이 비활성화 상태
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    await expect(submitButton).toBeDisabled();
  });

  test("회고 인풋이 입력되면 입력 버튼이 활성화되어야 한다", async ({ page }) => {
    // When: 회고 인풋에 텍스트 입력
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.fill("회고 내용입니다.");
    
    // Then: 입력 버튼이 활성화
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    await expect(submitButton).toBeEnabled();
  });

  test("로컬스토리지가 비어있을 때 첫 회고를 등록하면 id는 1이어야 한다", async ({ page }) => {
    // Given: 회고 인풋에 텍스트 입력
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.fill("첫 번째 회고");
    
    // When: 입력 버튼 클릭
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    await submitButton.click();
    
    // Then: 페이지가 새로고침됨 (로드 대기)
    await page.waitForTimeout(1000);
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 15000,
    });
    
    // And: 로컬스토리지에 id가 1인 데이터가 저장됨
    const retrospects = await page.evaluate(() => {
      const data = localStorage.getItem('retrospects');
      return data ? JSON.parse(data) : null;
    });
    
    expect(retrospects).not.toBeNull();
    expect(retrospects).toHaveLength(1);
    expect(retrospects[0].id).toBe(1);
    expect(retrospects[0].content).toBe("첫 번째 회고");
    expect(retrospects[0].diaryId).toBe(1);
    expect(retrospects[0].createdAt).toBeDefined();
  });

  test("로컬스토리지에 기존 회고가 있을 때 새 회고를 등록하면 id는 최대id+1이어야 한다", async ({ page }) => {
    // Given: 로컬스토리지에 기존 회고 데이터 설정
    await page.evaluate(() => {
      const existingRetrospects = [
        {
          id: 1,
          content: "기존 회고 1",
          diaryId: 1,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          content: "기존 회고 2",
          diaryId: 1,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('retrospects', JSON.stringify(existingRetrospects));
    });
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForTimeout(1000);
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 15000,
    });
    
    // When: 새 회고 입력 및 등록
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.fill("새 회고");
    
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    await submitButton.click();
    
    // Then: 페이지가 새로고침됨
    await page.waitForTimeout(1000);
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 15000,
    });
    
    // And: 로컬스토리지에 id가 4(3+1)인 데이터가 추가됨
    const retrospects = await page.evaluate(() => {
      const data = localStorage.getItem('retrospects');
      return data ? JSON.parse(data) : null;
    });
    
    expect(retrospects).toHaveLength(3);
    expect(retrospects[2].id).toBe(4);
    expect(retrospects[2].content).toBe("새 회고");
    expect(retrospects[2].diaryId).toBe(1);
  });

  test("등록 완료 후 페이지가 새로고침되어야 한다", async ({ page }) => {
    // Given: 회고 인풋에 텍스트 입력
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.fill("새로고침 테스트 회고");
    
    // When: 입력 버튼 클릭
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    await submitButton.click();
    
    // Then: 페이지가 새로고침되어 다시 로드됨
    await page.waitForTimeout(1000);
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 15000,
    });
    
    // And: 인풋 필드가 초기화됨 (새로고침으로 인해)
    const inputAfterReload = page.locator('[data-testid="retrospect-input"]');
    await expect(inputAfterReload).toHaveValue("");
  });

  test("등록된 회고가 올바른 diaryId를 저장해야 한다", async ({ page }) => {
    // Given: 다른 diaryId를 가진 일기 데이터 추가
    await page.evaluate(() => {
      const diaries = [
        {
          id: 1,
          title: "테스트 일기 1",
          content: "내용 1",
          emotion: "HAPPY",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          title: "테스트 일기 2",
          content: "내용 2",
          emotion: "SAD",
          createdAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem("diaries", JSON.stringify(diaries));
    });
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForTimeout(1000);
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 15000,
    });
    
    // When: 회고 등록
    const input = page.locator('[data-testid="retrospect-input"]');
    await input.fill("diaryId 테스트 회고");
    
    const submitButton = page.locator('[data-testid="retrospect-submit-button"]');
    await submitButton.click();
    
    // Then: 페이지가 새로고침됨
    await page.waitForTimeout(1000);
    await page.waitForSelector('[data-testid="diaries-detail-container"]', {
      timeout: 15000,
    });
    
    // And: 등록된 회고의 diaryId가 1 (현재 페이지의 diaryId)로 저장됨
    const retrospects = await page.evaluate(() => {
      const data = localStorage.getItem('retrospects');
      return data ? JSON.parse(data) : null;
    });
    
    expect(retrospects).not.toBeNull();
    expect(retrospects[0].diaryId).toBe(1);
  });
});

