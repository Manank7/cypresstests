# Cypress Test Repository

A basic Cypress testing setup with example tests and configuration.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd cypresstests
```

2. Install dependencies:

```bash
npm install
```

## Available Scripts

- `npm test` - Run all Cypress tests in headless mode
- `npm run cypress:open` - Open Cypress Test Runner in interactive mode
- `npm run cypress:run` - Run all tests in headless mode
- `npm run cypress:run:headed` - Run all tests with browser visible
- `npm run cypress:run:chrome` - Run tests specifically in Chrome browser
- `npm run cypress:run:firefox` - Run tests specifically in Firefox browser

## Project Structure

```
cypresstests/
├── cypress/
│   ├── e2e/                    # End-to-end test files
│   │   ├── example.cy.js       # Example tests using Cypress Kitchen Sink
│   │   └── google-search.cy.js # Google search functionality tests
│   ├── fixtures/               # Test data files
│   │   └── example.json        # Example fixture data
│   └── support/                # Support files
│       ├── commands.js         # Custom Cypress commands
│       └── e2e.js             # Global configuration for e2e tests
├── cypress.config.js           # Cypress configuration
├── package.json                # Project dependencies and scripts
└── README.md                   # This file
```

## Test Files

### example.cy.js

Contains basic tests demonstrating:

- Page navigation
- Element interaction (clicking, typing)
- Form handling
- Checkbox operations
- URL verification

### google-search.cy.js

Contains tests for Google search functionality:

- Search functionality
- Page element verification
- Cookie handling

## Running Tests

### Interactive Mode (Recommended for Development)

```bash
npm run cypress:open
```

This opens the Cypress Test Runner where you can:

- See all your test files
- Run tests individually
- Watch tests run in real-time
- Debug tests step by step

### Headless Mode (Recommended for CI/CD)

```bash
npm test
```

This runs all tests in the background and generates a report.

## Configuration

The main configuration is in `cypress.config.js`. You can modify:

- Base URL for your application
- Browser settings
- Test file patterns
- Viewport settings
- Timeout values

## Writing New Tests

1. Create a new `.cy.js` file in the `cypress/e2e/` directory
2. Use the following structure:

```javascript
describe("Your Test Suite", () => {
  beforeEach(() => {
    // Setup code that runs before each test
    cy.visit("your-app-url");
  });

  it("should do something specific", () => {
    // Your test code here
    cy.get("selector").should("be.visible");
  });
});
```

## Best Practices

1. **Use descriptive test names** - Make it clear what each test is checking
2. **Keep tests independent** - Each test should be able to run on its own
3. **Use data attributes** - Prefer `data-cy` attributes for element selection
4. **Handle async operations** - Use Cypress's built-in waiting mechanisms
5. **Clean up after tests** - Use `afterEach` or `after` hooks if needed

## Troubleshooting

### Common Issues

1. **Tests failing due to timing** - Use `cy.wait()` or `cy.get().should()` for better assertions
2. **Element not found** - Check if the element is visible and not hidden by overlays
3. **Cross-origin issues** - Configure `chromeWebSecurity: false` in config if needed

### Debug Mode

To debug tests, you can:

- Use `cy.pause()` in your test code
- Run tests in headed mode with `npm run cypress:run:headed`
- Use browser dev tools while tests are running

## Contributing

1. Create a new branch for your feature
2. Write tests for new functionality
3. Ensure all tests pass
4. Submit a pull request

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Cypress API Reference](https://docs.cypress.io/api/table-of-contents)
