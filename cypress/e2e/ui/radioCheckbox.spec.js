describe("Interactions and verifications on Radio Button and Checkbox", () => {
  it("should select the radio button and checkbox and verify the results", () => {
    cy.visit("https://testautomationpractice.blogspot.com/");

    cy.get("#male").check().should("be.checked");
    cy.get("#female").check().should("be.checked");
  });
});
