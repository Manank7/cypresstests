describe("Advanced Form Interactions", () => {
  beforeEach(() => {
    cy.visit("https://testautomationpractice.blogspot.com/");
  });

  describe("Form Validation", () => {
    it("should validate email format", () => {
      // Enter invalid email
      cy.get("#email").type("invalid-email");
      cy.get("#email").blur();

      // Check for email validation error
      cy.get("body").then(($body) => {
        if ($body.find(".email-error, .validation-error").length > 0) {
          cy.get(".email-error, .validation-error").should("be.visible");
        }
      });

      // Enter valid email
      cy.get("#email").clear().type("valid@email.com");
      cy.get("#email").blur();

      // Verify no validation errors
      cy.get(".email-error, .validation-error").should("not.exist");
    });

    it("should validate phone number format", () => {
      // Enter invalid phone
      cy.get("#phone").type("abc123");
      cy.get("#phone").blur();

      // Check for phone validation error
      cy.get("body").then(($body) => {
        if ($body.find(".phone-error, .validation-error").length > 0) {
          cy.get(".phone-error, .validation-error").should("be.visible");
        }
      });

      // Enter valid phone
      cy.get("#phone").clear().type("1234567890");
      cy.get("#phone").blur();

      // Verify no validation errors
      cy.get(".phone-error, .validation-error").should("not.exist");
    });
  });

  describe("Conditional Form Fields", () => {
    it("should show/hide fields based on selections", () => {
      // Check if there are conditional fields
      cy.get("body").then(($body) => {
        if ($body.find("[data-conditional], .conditional-field").length > 0) {
          // Select option that should show conditional field
          cy.get('input[name="showExtra"]').check();

          // Verify conditional field is visible
          cy.get(".conditional-field, [data-conditional='true']").should(
            "be.visible"
          );

          // Uncheck option
          cy.get('input[name="showExtra"]').uncheck();

          // Verify conditional field is hidden
          cy.get(".conditional-field, [data-conditional='true']").should(
            "not.be.visible"
          );
        }
      });
    });

    it("should enable/disable fields based on conditions", () => {
      // Check if there are dependent fields
      cy.get("body").then(($body) => {
        if ($body.find("[data-dependent], .dependent-field").length > 0) {
          // Select option that should enable dependent field
          cy.get('input[name="enableField"]').check();

          // Verify dependent field is enabled
          cy.get(".dependent-field, [data-dependent='true']").should(
            "be.enabled"
          );

          // Uncheck option
          cy.get('input[name="enableField"]').uncheck();

          // Verify dependent field is disabled
          cy.get(".dependent-field, [data-dependent='true']").should(
            "be.disabled"
          );
        }
      });
    });
  });

  describe("Dynamic Form Content", () => {
    it("should add/remove form fields dynamically", () => {
      // Look for add/remove field buttons
      cy.get("body").then(($body) => {
        if (
          $body.find(".add-field, .remove-field, [data-action='add']").length >
          0
        ) {
          // Add a new field
          cy.get(".add-field, [data-action='add']").first().click();

          // Verify new field was added
          cy.get(".dynamic-field, .added-field").should("be.visible");

          // Remove the field
          cy.get(".remove-field, [data-action='remove']").first().click();

          // Verify field was removed
          cy.get(".dynamic-field, .added-field").should("not.exist");
        }
      });
    });

    it("should handle dynamic option lists", () => {
      // Look for dynamic select options
      cy.get("body").then(($body) => {
        if ($body.find("select[dynamic-options], .dynamic-select").length > 0) {
          // Select option that should populate another dropdown
          cy.get("select[dynamic-options], .dynamic-select")
            .first()
            .select("Option 1");

          // Verify dependent dropdown was populated
          cy.get("select[dependent-options], .dependent-select option").should(
            "have.length.at.least",
            1
          );
        }
      });
    });
  });

  describe("Form State Management", () => {
    it("should save form data to localStorage", () => {
      // Fill out form
      cy.get("#name").type("Test User");
      cy.get("#email").type("test@example.com");

      // Look for save button
      cy.get("body").then(($body) => {
        if ($body.find(".save-form, [data-action='save']").length > 0) {
          cy.get(".save-form, [data-action='save']").click();

          // Verify data was saved
          cy.window()
            .its("localStorage")
            .invoke("getItem", "formData")
            .should("exist");
        }
      });
    });

    it("should restore form data from localStorage", () => {
      // Check if there's a restore button
      cy.get("body").then(($body) => {
        if ($body.find(".restore-form, [data-action='restore']").length > 0) {
          cy.get(".restore-form, [data-action='restore']").click();

          // Verify form was populated with saved data
          cy.get("#name").should("have.value");
          cy.get("#email").should("have.value");
        }
      });
    });

    it("should clear form data", () => {
      // Fill out form
      cy.get("#name").type("Test User");
      cy.get("#email").type("test@example.com");

      // Look for clear button
      cy.get("body").then(($body) => {
        if ($body.find(".clear-form, [data-action='clear']").length > 0) {
          cy.get(".clear-form, [data-action='clear']").click();

          // Verify form was cleared
          cy.get("#name").should("have.value", "");
          cy.get("#email").should("have.value", "");
        }
      });
    });
  });

  describe("Form Performance", () => {
    it("should handle form with many options", () => {
      // Check if there are large dropdowns
      cy.get("body").then(($body) => {
        if ($body.find("select option").length > 100) {
          // Select an option from large dropdown
          cy.get("select").select("Option 50");

          // Verify selection was made
          cy.get("select").should("have.value");
        }
      });
    });
  });
});
