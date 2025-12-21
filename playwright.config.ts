import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright 1.44 설정 파일
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  //   testDir: "./tests",

  //   /* 병렬 테스트 실행 */
  //   fullyParallel: true,

  //   /* CI 환경에서 재시도 설정 */
  //   forbidOnly: !!process.env.CI,
  //   retries: process.env.CI ? 2 : 0,

  //   /* CI에서 병렬 실행 워커 수 조정 */
  //   workers: process.env.CI ? 1 : undefined,

  //   /* 리포터 설정 */
  //   reporter: "html",

  /* 모든 테스트에 공통으로 적용되는 설정 */
  use: {
    /* 액션 실패 시 재시도 전에 대기할 최대 시간 */
    // actionTimeout: 0,

    /* 베이스 URL (예: http://localhost:3000) */
    baseURL: "http://localhost:3000",

    /* 실패한 테스트의 트레이스 수집 */
    // trace: "on-first-retry",

    /* 스크린샷 설정 */
    // screenshot: "only-on-failure",
  },

  /* 다양한 브라우저 환경에서 테스트 실행 설정 */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* 모바일 뷰포트 테스트 */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* 브랜드 브라우저 테스트 */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* 테스트 전에 개발 서버 실행 설정 */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
