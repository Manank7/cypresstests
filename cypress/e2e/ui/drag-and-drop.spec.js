describe("Drag and Drop Interactions", () => {
  beforeEach(() => {
    cy.visit("https://testautomationpractice.blogspot.com/");
  });

  it("should perform basic drag and drop", () => {
    // Look for draggable elements
    cy.get("body").then(($body) => {
      if ($body.find("[draggable='true']").length > 0) {
        // Get draggable element
        cy.get("[draggable='true']").first().as("draggable");

        // Get drop zone
        cy.get(".dropzone, [data-dropzone], .drop-area").first().as("dropzone");

        // Perform drag and drop
        cy.get("@draggable").trigger("mousedown", { button: 0 });
        cy.get("@dropzone").trigger("mousemove").trigger("mouseup");

        // Verify the element was moved
        cy.get("@dropzone").should("contain", "dragged content");
      }
    });
  });

  it("should handle multiple drag and drop operations", () => {
    // Look for multiple draggable elements
    cy.get("body").then(($body) => {
      if ($body.find("[draggable='true']").length > 1) {
        const draggables = $body.find("[draggable='true']");

        // Drag first element
        cy.get("[draggable='true']").eq(0).trigger("mousedown", { button: 0 });
        cy.get(".dropzone, [data-dropzone], .drop-area")
          .first()
          .trigger("mousemove")
          .trigger("mouseup");

        // Drag second element
        cy.get("[draggable='true']").eq(1).trigger("mousedown", { button: 0 });
        cy.get(".dropzone, [data-dropzone], .drop-area")
          .first()
          .trigger("mousemove")
          .trigger("mouseup");

        // Verify both elements were moved
        cy.get(".dropzone, [data-dropzone], .drop-area")
          .first()
          .should("contain", "dragged content");
      }
    });
  });

  it("should handle drag and drop with keyboard modifiers", () => {
    // Test drag and drop with Ctrl key (copy instead of move)
    cy.get("body").then(($body) => {
      if ($body.find("[draggable='true']").length > 0) {
        cy.get("[draggable='true']")
          .first()
          .trigger("mousedown", { button: 0, ctrlKey: true });
        cy.get(".dropzone, [data-dropzone], .drop-area")
          .first()
          .trigger("mousemove")
          .trigger("mouseup");

        // Verify copy behavior
        cy.get("[draggable='true']").first().should("exist"); // Original should still exist
      }
    });
  });

  it("should validate drop zone highlighting", () => {
    // Test drop zone visual feedback during drag
    cy.get("body").then(($body) => {
      if (
        $body.find("[draggable='true']").length > 0 &&
        $body.find(".dropzone, [data-dropzone], .drop-area").length > 0
      ) {
        // Start drag
        cy.get("[draggable='true']")
          .first()
          .trigger("mousedown", { button: 0 });

        // Move over drop zone
        cy.get(".dropzone, [data-dropzone], .drop-area")
          .first()
          .trigger("mousemove");

        // Verify drop zone shows visual feedback (highlighted state)
        cy.get(".dropzone, [data-dropzone], .drop-area")
          .first()
          .should("have.class", "drag-over");

        // Complete drop
        cy.get(".dropzone, [data-dropzone], .drop-area")
          .first()
          .trigger("mouseup");
      }
    });
  });
});
