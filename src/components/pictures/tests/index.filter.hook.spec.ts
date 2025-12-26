import { test, expect } from "@playwright/test";

/**
 * Pictures Filter Hook 테스트
 *
 * 테스트 시나리오:
 * 1. 페이지 접속 시 기본 필터(640x640)가 선택되어 있어야 함
 * 2. 필터를 "가로형"으로 변경 시 이미지 크기가 640x480으로 변경되어야 함
 * 3. 필터를 "세로형"으로 변경 시 이미지 크기가 480x640으로 변경되어야 함
 * 4. 필터를 "기본"으로 변경 시 이미지 크기가 640x640으로 변경되어야 함
 *
 * 테스트 대상:
 * - useFilterHook Hook
 * - 필터 선택박스 UI
 * - 이미지 크기 변경 기능
 *
 * 테스트 조건:
 * - timeout: 네트워크 통신 2000ms 미만, 그 외 500ms 미만
 * - data-testid로 페이지 로드 확인
 * - 실제 데이터 사용 (Mock 데이터 미사용)
 */

test.describe("강아지 사진 필터 기능", () => {
  test("페이지 접속 시 기본 필터(640x640)가 선택되어 있어야 한다", async ({
    page,
  }) => {
    // When: /pictures 페이지로 이동
    await page.goto("/pictures");

    // Then: 페이지가 완전히 로드될 때까지 대기 (data-testid 사용)
    await page.waitForSelector('[data-testid="pictures-container"]', {
      timeout: 1999,
    });

    // And: 강아지 이미지들이 표시됨 (이미지 로딩은 네트워크 통신이므로 timeout 설정)
    const dogImages = page.locator(
      '[data-testid^="dog-image-"]:not([data-testid*="wrapper"])'
    );
    await expect(dogImages.first()).toBeVisible({ timeout: 1999 });

    // And: 첫 번째 이미지의 크기가 640x640이어야 함
    const firstImage = dogImages.first();
    await expect(firstImage).toBeVisible();
    const imageId = await firstImage.getAttribute("data-testid");
    const imageIdNumber = imageId?.replace("dog-image-", "") || "0";
    const imageWrapper = page.locator(
      `[data-testid="dog-image-wrapper-${imageIdNumber}"]`
    );
    await expect(imageWrapper).toBeVisible();

    // 인라인 스타일로 설정된 크기 확인
    await expect(imageWrapper).toHaveCSS("width", "640px");
    await expect(imageWrapper).toHaveCSS("height", "640px");
  });

  test("필터를 '가로형'으로 변경 시 이미지 크기가 640x480으로 변경되어야 한다", async ({
    page,
  }) => {
    // When: /pictures 페이지로 이동
    await page.goto("/pictures");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="pictures-container"]', {
      timeout: 1999,
    });

    // And: 강아지 이미지들이 표시됨 (이미지 로딩은 네트워크 통신이므로 timeout 설정)
    const dogImages = page.locator(
      '[data-testid^="dog-image-"]:not([data-testid*="wrapper"])'
    );
    await expect(dogImages.first()).toBeVisible({ timeout: 1999 });

    // When: 필터 선택박스를 클릭하여 드롭다운 열기
    const selectBox = page.locator('[data-testid="pictures-filter-selectbox"]');
    await selectBox.click();

    // And: 드롭다운이 완전히 열릴 때까지 대기
    await page.waitForTimeout(100);

    // And: "가로형" 옵션 선택
    const horizontalOption = page.locator(
      '[data-testid="pictures-filter-option-horizontal"]'
    );
    await expect(horizontalOption).toBeVisible();
    await horizontalOption.click({ force: true });

    // Then: 이미지 크기가 640x480으로 변경됨
    const firstImage = dogImages.first();
    await expect(firstImage).toBeVisible();
    const imageId = await firstImage.getAttribute("data-testid");
    const imageIdNumber = imageId?.replace("dog-image-", "") || "0";
    const imageWrapper = page.locator(
      `[data-testid="dog-image-wrapper-${imageIdNumber}"]`
    );
    await expect(imageWrapper).toBeVisible();

    // 인라인 스타일로 설정된 크기 확인
    await expect(imageWrapper).toHaveCSS("width", "640px");
    await expect(imageWrapper).toHaveCSS("height", "480px");
  });

  test("필터를 '세로형'으로 변경 시 이미지 크기가 480x640으로 변경되어야 한다", async ({
    page,
  }) => {
    // When: /pictures 페이지로 이동
    await page.goto("/pictures");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="pictures-container"]', {
      timeout: 1999,
    });

    // And: 강아지 이미지들이 표시됨 (이미지 로딩은 네트워크 통신이므로 timeout 설정)
    const dogImages = page.locator(
      '[data-testid^="dog-image-"]:not([data-testid*="wrapper"])'
    );
    await expect(dogImages.first()).toBeVisible({ timeout: 1999 });

    // When: 필터 선택박스를 클릭하여 드롭다운 열기
    const selectBox = page.locator('[data-testid="pictures-filter-selectbox"]');
    await selectBox.click();

    // And: 드롭다운이 완전히 열릴 때까지 대기
    await page.waitForTimeout(100);

    // And: "세로형" 옵션 선택
    const verticalOption = page.locator(
      '[data-testid="pictures-filter-option-vertical"]'
    );
    await expect(verticalOption).toBeVisible();
    await verticalOption.click({ force: true });

    // Then: 이미지 크기가 480x640으로 변경됨
    const firstImage = dogImages.first();
    await expect(firstImage).toBeVisible();
    const imageId = await firstImage.getAttribute("data-testid");
    const imageIdNumber = imageId?.replace("dog-image-", "") || "0";
    const imageWrapper = page.locator(
      `[data-testid="dog-image-wrapper-${imageIdNumber}"]`
    );
    await expect(imageWrapper).toBeVisible();

    // 인라인 스타일로 설정된 크기 확인
    await expect(imageWrapper).toHaveCSS("width", "480px");
    await expect(imageWrapper).toHaveCSS("height", "640px");
  });

  test("필터를 '기본'으로 변경 시 이미지 크기가 640x640으로 변경되어야 한다", async ({
    page,
  }) => {
    // When: /pictures 페이지로 이동
    await page.goto("/pictures");

    // Then: 페이지가 완전히 로드될 때까지 대기
    await page.waitForSelector('[data-testid="pictures-container"]', {
      timeout: 1999,
    });

    // And: 강아지 이미지들이 표시됨 (이미지 로딩은 네트워크 통신이므로 timeout 설정)
    const dogImages = page.locator(
      '[data-testid^="dog-image-"]:not([data-testid*="wrapper"])'
    );
    await expect(dogImages.first()).toBeVisible({ timeout: 1999 });

    // Given: 필터를 먼저 "가로형"으로 변경
    const selectBox = page.locator('[data-testid="pictures-filter-selectbox"]');
    await selectBox.click();
    await page.waitForTimeout(100);
    const horizontalOption = page.locator(
      '[data-testid="pictures-filter-option-horizontal"]'
    );
    await expect(horizontalOption).toBeVisible();
    await horizontalOption.click({ force: true });

    // When: 필터 선택박스를 다시 클릭하여 드롭다운 열기
    await selectBox.click();
    await page.waitForTimeout(100);

    // And: "기본" 옵션 선택
    const defaultOption = page.locator(
      '[data-testid="pictures-filter-option-default"]'
    );
    await expect(defaultOption).toBeVisible();
    await defaultOption.click({ force: true });

    // Then: 이미지 크기가 640x640으로 변경됨
    const firstImage = dogImages.first();
    await expect(firstImage).toBeVisible();
    const imageId = await firstImage.getAttribute("data-testid");
    const imageIdNumber = imageId?.replace("dog-image-", "") || "0";
    const imageWrapper = page.locator(
      `[data-testid="dog-image-wrapper-${imageIdNumber}"]`
    );
    await expect(imageWrapper).toBeVisible();

    // 인라인 스타일로 설정된 크기 확인
    await expect(imageWrapper).toHaveCSS("width", "640px");
    await expect(imageWrapper).toHaveCSS("height", "640px");
  });
});
