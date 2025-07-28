describe("Interactions and verifications on Alerts", () => {
  beforeEach(() => {
    cy.visit("https://testautomationpractice.blogspot.com/");
  });

  it("should handle alerts", () => {
    cy.get("#alertBtn").click();
    cy.on("window:alert", (text) => {
      expect(text).to.equal("I am an alert box!");
    });
  });

  it("should handle confirm alerts", () => {
    cy.get("#confirmBtn").click();
    cy.on("window:confirm", (text) => {
      expect(text).to.equal("Press a button!");
    });
  });

  it("should handle prompt alerts", () => {
    cy.window().then((win) => {
      cy.stub(win, "prompt").returns("Manan Kumar");
    });
    cy.get("#promptBtn").click();
    cy.get("#demo").should(
      "contain.text",
      "Hello Manan Kumar! How are you today?"
    );
  });
});
