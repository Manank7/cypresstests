describe("Example Test Suite", () => {
  beforeEach(() => {
    // Visit the Cypress example page before each test
    cy.visit("https://example.cypress.io");
  });

  it("should load the page successfully", () => {
    // Check if the page loads
    cy.get("h1").should("contain", "Kitchen Sink");
  });

  it("should navigate to the actions page", () => {
    // Click on the actions link
    cy.contains("Actions").click();

    // Verify we're on the actions page
    cy.url().should("include", "/commands/actions");
    cy.get("h1").should("contain", "Actions");
  });

  it("should fill out a form", () => {
    // Navigate to the actions page
    cy.contains("Actions").click();

    // Fill out the email input
    cy.get("#email1").type("test@example.com");

    // Verify the input has the correct value
    cy.get("#email1").should("have.value", "test@example.com");
  });

  it("should handle checkboxes", () => {
    // Navigate to the actions page
    cy.contains("Actions").click();

    // Check a checkbox
    cy.get("#checkbox1").check().should("be.checked");

    // Uncheck the checkbox
    cy.get("#checkbox1").uncheck().should("not.be.checked");
  });
});
