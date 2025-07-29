describe("Interactions and verifications on Dropdowns", () => {
  beforeEach(() => {
    cy.visit("https://testautomationpractice.blogspot.com/");
  });

  it("should select the dropdown and verify the results", () => {
    cy.get("#country").select("Germany").should("have.value", "germany");
    cy.get("#country").select("India").should("have.value", "india");
  });

  it("should select multiple options in the multi select list", () => {
    cy.get("#colors").should("exist").and("be.visible");

    cy.get("#colors").then(($select) => {
      const options = $select.find("option");
      cy.log(`Found ${options.length} options in the dropdown`);

      const isMultiple = $select.attr("multiple");
      cy.log(`Is multiple select: ${isMultiple}`);

      if (isMultiple) {
        // Get the first two available options
        const firstOption = options.eq(0).val();
        const secondOption = options.eq(1).val();

        cy.log(`Selecting options: ${firstOption}, ${secondOption}`);

        // Select the first two options
        cy.get("#colors").select([firstOption, secondOption]);

        // Verify selections
        cy.get("#colors option:selected").then(($selected) => {
          cy.log(`Actually selected ${$selected.length} options`);
          expect($selected.length).to.be.at.least(1);
        });

        // Check if the first option is selected
        cy.get(`#colors option[value='${firstOption}']`).should("be.selected");
      } else {
        // If it's not a multi-select
        const firstOption = options.eq(0).val();
        cy.log(`Single select dropdown, selecting: ${firstOption}`);

        cy.get("#colors").select(firstOption);
        cy.get("#colors option:selected").should("have.length", 1);
        cy.get(`#colors option[value='${firstOption}']`).should("be.selected");
      }
    });
  });
});
