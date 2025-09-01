const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.spec.js",
    baseUrl:
      process.env.CYPRESS_BASE_URL ||
      "https://testautomationpractice.blogspot.com/",
    video: true,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    env: {
      environment: process.env.NODE_ENV || "development",
    },
    // Handle rate limiting and other non-2xx responses globally
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    // Disable fail on non-2xx status codes globally
    failOnStatusCode: false,
  },
  // CI/CD specific settings
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
