describe("Modal and Popup Interactions", () => {
  beforeEach(() => {
    cy.visit("https://testautomationpractice.blogspot.com/");
  });

  it("should open and close modal dialogs", () => {
    // Look for modal trigger buttons
    cy.get("body").then(($body) => {
      if (
        $body.find(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        ).length > 0
      ) {
        // Click modal trigger
        cy.get(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        )
          .first()
          .click();

        // Verify modal is visible
        cy.get(".modal, .modal-dialog, [role='dialog']").should("be.visible");

        // Close modal
        cy.get(
          ".modal .close, .modal .btn-close, .modal [data-dismiss='modal']"
        ).click();

        // Verify modal is hidden
        cy.get(".modal, .modal-dialog, [role='dialog']").should(
          "not.be.visible"
        );
      }
    });
  });

  it("should handle modal content interactions", () => {
    // Open modal
    cy.get("body").then(($body) => {
      if (
        $body.find(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        ).length > 0
      ) {
        cy.get(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        )
          .first()
          .click();

        // Interact with form elements inside modal
        cy.get(".modal input, .modal select, .modal textarea").each(
          ($input) => {
            if (
              $input.attr("type") === "text" ||
              $input.attr("type") === "email"
            ) {
              cy.wrap($input).type("Test Input");
            } else if ($input.attr("type") === "checkbox") {
              cy.wrap($input).check();
            } else if ($input.attr("type") === "radio") {
              cy.wrap($input).check();
            }
          }
        );

        // Submit modal form if exists
        cy.get(
          ".modal .btn-primary, .modal .btn-success, .modal input[type='submit']"
        ).then(($submitBtn) => {
          if ($submitBtn.length > 0) {
            cy.wrap($submitBtn).click();
          }
        });

        // Close modal
        cy.get(
          ".modal .close, .modal .btn-close, .modal [data-dismiss='modal']"
        ).click();
      }
    });
  });

  it("should handle tooltip displays", () => {
    // Look for elements with tooltips
    cy.get("body").then(($body) => {
      if (
        $body.find("[title], [data-toggle='tooltip'], [data-tooltip]").length >
        0
      ) {
        // Hover over element with tooltip
        cy.get("[title], [data-toggle='tooltip'], [data-tooltip]")
          .first()
          .trigger("mouseover");

        // Verify tooltip is visible
        cy.get(".tooltip, .tooltip-inner, [role='tooltip']").should(
          "be.visible"
        );

        // Move mouse away
        cy.get("[title], [data-toggle='tooltip'], [data-tooltip]")
          .first()
          .trigger("mouseout");

        // Verify tooltip is hidden
        cy.get(".tooltip, .tooltip-inner, [role='tooltip']").should(
          "not.be.visible"
        );
      }
    });
  });

  it("should handle confirmation dialogs", () => {
    // Look for confirmation triggers
    cy.get("body").then(($body) => {
      if (
        $body.find(".confirm-trigger, .btn[onclick*='confirm'], [data-confirm]")
          .length > 0
      ) {
        // Set up confirm dialog handler
        cy.on("window:confirm", (text) => {
          expect(text).to.contain("confirm");
          return true; // Accept confirmation
        });

        // Click confirmation trigger
        cy.get(".confirm-trigger, .btn[onclick*='confirm'], [data-confirm]")
          .first()
          .click();

        // Verify confirmation was accepted
        cy.get("body").should("contain", "confirmed");
      }
    });
  });

  it("should handle modal backdrop clicks", () => {
    // Open modal
    cy.get("body").then(($body) => {
      if (
        $body.find(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        ).length > 0
      ) {
        cy.get(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        )
          .first()
          .click();

        // Click on modal backdrop
        cy.get(".modal-backdrop, .modal").click({ force: true });

        // Verify modal is closed
        cy.get(".modal, .modal-dialog, [role='dialog']").should(
          "not.be.visible"
        );
      }
    });
  });

  it("should handle escape key to close modal", () => {
    // Open modal
    cy.get("body").then(($body) => {
      if (
        $body.find(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        ).length > 0
      ) {
        cy.get(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        )
          .first()
          .click();

        // Press escape key
        cy.get("body").type("{esc}");

        // Verify modal is closed
        cy.get(".modal, .modal-dialog, [role='dialog']").should(
          "not.be.visible"
        );
      }
    });
  });

  it("should handle multiple modals", () => {
    // Look for multiple modal triggers
    cy.get("body").then(($body) => {
      if (
        $body.find(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        ).length > 1
      ) {
        // Open first modal
        cy.get(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        )
          .eq(0)
          .click();
        cy.get(".modal, .modal-dialog, [role='dialog']").should("be.visible");

        // Open second modal (should stack or replace first)
        cy.get(
          "[data-toggle='modal'], .modal-trigger, .btn[data-target*='modal']"
        )
          .eq(1)
          .click();

        // Verify modal behavior (either stacked or replaced)
        cy.get(".modal, .modal-dialog, [role='dialog']").should("be.visible");

        // Close all modals
        cy.get(
          ".modal .close, .modal .btn-close, .modal [data-dismiss='modal']"
        ).each(($closeBtn) => {
          cy.wrap($closeBtn).click();
        });
      }
    });
  });
});
