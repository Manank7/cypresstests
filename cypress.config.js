const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/e2e/**/*.spec.js",
    // Remove baseUrl for API tests that don't need a local server
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
  },
  // CI/CD specific settings
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
