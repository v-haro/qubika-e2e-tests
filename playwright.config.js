// playwright.config.js

// @ts-check
const { devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config = {
  /* The base URL to use in actions like `await page.goto('/')`. */
  // baseURL: 'https://my.base.url',

  /* Run tests in files in parallel */
  workers: 1,

  /* Configure projects for major browsers */
  projects: [
    /* Test against desktop browsers */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Global setup for all tests */
  // globalSetup: require.resolve('./global-setup'),
};

module.exports = config;
