describe("Google Search Test", () => {
  beforeEach(() => {
    // Visit Google before each test
    cy.visit("https://www.google.com");

    // Accept cookies if the dialog appears
    cy.get("body").then(($body) => {
      if ($body.find('[aria-label="Accept all"]').length > 0) {
        cy.get('[aria-label="Accept all"]').click();
      }
    });
  });

  it("should search for Cypress and verify results", () => {
    // Type in the search box
    cy.get('textarea[name="q"]').type("Cypress testing framework");

    // Submit the search
    cy.get('textarea[name="q"]').type("{enter}");

    // Verify search results appear
    cy.get("#search").should("be.visible");

    // Verify Cypress appears in the results
    cy.contains("Cypress").should("be.visible");
  });

  it("should verify Google homepage elements", () => {
    // Check if Google logo is present
    cy.get('img[alt="Google"]').should("be.visible");

    // Check if search box is present and focused
    cy.get('textarea[name="q"]').should("be.visible").and("be.focused");

    // Check if search buttons are present
    cy.get('input[name="btnK"]').should("be.visible");
  });
});
