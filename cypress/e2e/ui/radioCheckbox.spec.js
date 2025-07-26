describe("Interactions and verifications on Radio Button and Checkbox", () => {
  before(() => {
    cy.visit("https://testautomationpractice.blogspot.com/");
  });
  it("should select the radio button and checkbox and verify the results", () => {
    cy.get("#male").check().should("be.checked");
    cy.get("#female").check().should("be.checked");

    cy.get("#sunday").check().should("be.checked");
    cy.get("#monday").check().should("be.checked");
    cy.get("#tuesday").check().should("be.checked");
    cy.get("#wednesday").check().should("be.checked");

    cy.get("#thursday").should("not.be.checked");
    cy.get("#friday").should("not.be.checked");
    cy.get("#saturday").should("not.be.checked");

    cy.get("#sunday").uncheck().should("not.be.checked");
    cy.get("#monday").uncheck().should("not.be.checked");
    cy.get("#tuesday").uncheck().should("not.be.checked");
  });
});
