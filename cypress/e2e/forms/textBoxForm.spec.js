describe("Interactions and verifications on Multiple Text Box", () => {
  it("should fill in the form and verify the results", () => {
    cy.visit("https://testautomationpractice.blogspot.com/");

    cy.get("#name").type("Manan");
    cy.get("#email").type("manan.test@example.com");
    cy.get("#phone").type("1234567890");
    cy.get("#textarea").type("Bengaluru, Karnataka, India");
  });
});
