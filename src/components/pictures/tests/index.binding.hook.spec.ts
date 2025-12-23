import { test, expect } from "@playwright/test";

/**
 * Pictures Binding Hook 테스트
 * 
 * 테스트 시나리오:
 * 1. 페이지 접속 시 강아지 목록 조회 API 요청
 * 2. 로딩 중 스플래시 스크린 표시 (6개)
 * 3. 조회 성공 시 6마리 강아지 이미지 표시
 * 4. 무한 스크롤: 마지막 2개만 남았을 때 추가 로드
 * 
 * 테스트 대상:
 * - useBindingHook Hook
 * - dog.ceo API 연동
 * - 스플래시 스크린 UI
 * - 무한 스크롤 기능
 * 
 * 테스트 조건:
 * - timeout: 네트워크 통신 2000ms 미만, 그 외 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용) - 성공 시나리오
 * - API 모킹 - 실패 시나리오
 */

test.describe("강아지 사진 목록 페이지 데이터 바인딩", () => {
  test("페이지 접속 시 강아지 목록 조회 API를 요청하고 6마리 강아지 이미지를 표시해야 한다", async ({ page }) => {
    // When: /pictures 페이지로 이동
    await page.goto("/pictures");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="pictures-container"]', {
      timeout: 1999,
    });

    // And: 강아지 이미지들이 표시됨 (dog.ceo가 포함된 이미지 주소)
    const dogImages = page.locator('[data-testid^="dog-image-"]');
    await expect(dogImages).toHaveCount(6, { timeout: 1999 });

    // And: 각 이미지가 로드될 때까지 대기
    for (let i = 0; i < 6; i++) {
      const image = page.locator(`[data-testid="dog-image-${i}"]`);
      await expect(image).toBeVisible({ timeout: 1999 });
      
      const src = await image.getAttribute("src");
      expect(src).toBeTruthy();
      // Next.js Image 컴포넌트는 src에 전체 URL이 아닐 수 있으므로, 
      // 실제 이미지 URL을 확인하기 위해 다른 방법 사용
      if (src && !src.startsWith("data:")) {
        // src가 data URL이 아니면 dog.ceo가 포함되어야 함
        expect(src).toContain("dog.ceo");
      }
    }
  });

  test("로딩 중에는 6개의 스플래시 스크린이 표시되어야 한다", async ({ page }) => {
    // Given: 네트워크 속도를 느리게 설정하여 로딩 시간 확보
    await page.route("https://dog.ceo/api/breeds/image/random/6", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    // When: /pictures 페이지로 이동
    await page.goto("/pictures");

    // Then: 스플래시 스크린이 표시됨
    const splashScreens = page.locator('[data-testid^="splash-screen-"]');
    await expect(splashScreens.first()).toBeVisible({ timeout: 499 });

    // And: 스플래시 스크린이 6개 표시됨
    await expect(splashScreens).toHaveCount(6, { timeout: 499 });
  });

  test("스크롤이 마지막 2개만 남았을 때 추가 강아지를 요청해야 한다", async ({ page }) => {
    // When: /pictures 페이지로 이동
    await page.goto("/pictures");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="pictures-container"]', {
      timeout: 1999,
    });

    // And: 초기 6마리 강아지 이미지가 표시됨
    const initialImages = page.locator('[data-testid^="dog-image-"]');
    await expect(initialImages).toHaveCount(6, { timeout: 1999 });

    // And: 각 이미지가 로드될 때까지 대기
    for (let i = 0; i < 6; i++) {
      const image = page.locator(`[data-testid="dog-image-${i}"]`);
      await expect(image).toBeVisible({ timeout: 1999 });
    }

    // When: 스크롤 타겟이 보이도록 스크롤 (마지막에서 2번째 이미지 다음)
    const scrollTarget = page.locator('[data-testid="scroll-target"]');
    
    // 스크롤 타겟이 나타날 때까지 대기
    await scrollTarget.waitFor({ state: "attached", timeout: 1999 });
    
    // 스크롤 타겟이 보이도록 스크롤
    await scrollTarget.scrollIntoViewIfNeeded({ timeout: 499 });

    // Then: 추가 강아지 이미지가 로드됨 (총 12개 이상)
    // IntersectionObserver가 트리거되어 자동으로 로드되므로, 이미지가 추가될 때까지 대기
    const allImages = page.locator('[data-testid^="dog-image-"]');
    await expect(allImages).toHaveCount(12, { timeout: 1999 });

    // And: 새로 추가된 이미지들도 표시됨
    const newImage = page.locator('[data-testid="dog-image-6"]');
    await expect(newImage).toBeVisible({ timeout: 1999 });
  });

  test("API 요청 실패 시 에러 처리가 되어야 한다", async ({ page }) => {
    // Given: API 요청을 모킹하여 실패 응답 반환
    await page.route("https://dog.ceo/api/breeds/image/random/6", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Internal Server Error" }),
      });
    });

    // When: /pictures 페이지로 이동
    await page.goto("/pictures");

    // Then: 페이지가 로드되며 에러가 발생하지 않음
    await page.waitForSelector('[data-testid="pictures-container"]', {
      timeout: 1999,
    });

    // And: 에러 상태가 표시되거나 빈 상태로 표시됨
    // (구현에 따라 에러 메시지 또는 빈 상태 표시)
    const dogImages = page.locator('[data-testid^="dog-image-"]');
    const count = await dogImages.count({ timeout: 499 });
    expect(count).toBe(0);
  });
});

