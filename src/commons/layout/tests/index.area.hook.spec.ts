import { test, expect } from "@playwright/test";

/**
 * Layout Area Hook 테스트
 * 
 * 테스트 시나리오:
 * URL에 따라 Layout의 각 영역(header, banner, navigation, footer) 노출 여부를 제어
 * 
 * 테스트 제외 경로:
 * - /auth/login
 * - /auth/signup
 * - /pictures
 */

test.describe("Layout Area Visibility", () => {
  test("일기목록 페이지(/diaries)에서 모든 영역 표시", async ({ page }) => {
    // Given: 일기목록 페이지로 이동
    await page.goto("/diaries");
    await page.waitForSelector('[data-testid="layout-container"]');
    
    // Then: header 영역 표시
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // And: header 내 로고 표시
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();
    
    // And: banner 영역 표시
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeVisible();
    
    // And: navigation 영역 표시
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeVisible();
    
    // And: footer 영역 표시
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  test("일기상세 페이지(/diaries/:id)에서 일부 영역만 표시", async ({ page }) => {
    // Given: 일기상세 페이지로 이동 (예: /diaries/1)
    await page.goto("/diaries/1");
    await page.waitForSelector('[data-testid="layout-container"]');
    
    // Then: header 영역 표시
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // And: header 내 로고 표시
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();
    
    // And: banner 영역 숨김
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();
    
    // And: navigation 영역 숨김
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();
    
    // And: footer 영역 표시
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });

  // /auth/login 테스트는 skip (요구사항에 따름)
  test.skip("로그인 페이지(/auth/login)에서 모든 영역 숨김", async ({ page }) => {
    // Given: 로그인 페이지로 이동
    await page.goto("/auth/login");
    await page.waitForSelector('[data-testid="auth-login-container"]');
    
    // Then: header 영역 숨김
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).not.toBeVisible();
    
    // And: banner 영역 숨김
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();
    
    // And: navigation 영역 숨김
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();
    
    // And: footer 영역 숨김
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).not.toBeVisible();
  });

  // /auth/signup 테스트는 skip (요구사항에 따름)
  test.skip("회원가입 페이지(/auth/signup)에서 모든 영역 숨김", async ({ page }) => {
    // Given: 회원가입 페이지로 이동
    await page.goto("/auth/signup");
    await page.waitForSelector('[data-testid="auth-signup-container"]');
    
    // Then: header 영역 숨김
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).not.toBeVisible();
    
    // And: banner 영역 숨김
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).not.toBeVisible();
    
    // And: navigation 영역 숨김
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).not.toBeVisible();
    
    // And: footer 영역 숨김
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).not.toBeVisible();
  });

  // /pictures 테스트는 skip (요구사항에 따름)
  test.skip("사진목록 페이지(/pictures)에서 모든 영역 표시", async ({ page }) => {
    // Given: 사진목록 페이지로 이동
    await page.goto("/pictures");
    await page.waitForSelector('[data-testid="layout-container"]');
    
    // Then: header 영역 표시
    const header = page.locator('[data-testid="layout-header"]');
    await expect(header).toBeVisible();
    
    // And: header 내 로고 표시
    const logo = page.locator('[data-testid="layout-logo"]');
    await expect(logo).toBeVisible();
    
    // And: banner 영역 표시
    const banner = page.locator('[data-testid="layout-banner"]');
    await expect(banner).toBeVisible();
    
    // And: navigation 영역 표시
    const navigation = page.locator('[data-testid="layout-navigation"]');
    await expect(navigation).toBeVisible();
    
    // And: footer 영역 표시
    const footer = page.locator('[data-testid="layout-footer"]');
    await expect(footer).toBeVisible();
  });
});

