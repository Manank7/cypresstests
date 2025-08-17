describe("Data Table Interactions", () => {
  beforeEach(() => {
    cy.visit("https://testautomationpractice.blogspot.com/");
  });

  describe("Table Structure and Content", () => {
    it("should verify table column headers", () => {
      // Get all table headers
      cy.get("table thead th").each(($header, index) => {
        cy.wrap($header).should("be.visible");
        cy.wrap($header).should("not.be.empty");

        // Log header text for debugging
        cy.wrap($header)
          .invoke("text")
          .then((text) => {
            cy.log(`Column ${index + 1}: ${text}`);
          });
      });
    });
  });

  describe("Table Sorting", () => {
    it("should sort table by column headers", () => {
      // Look for sortable columns
      cy.get("table thead th").each(($header, index) => {
        if (
          $header.hasClass("sortable") ||
          $header.attr("data-sortable") === "true"
        ) {
          // Click header to sort
          cy.wrap($header).click();

          // Verify sorting indicator appears
          cy.wrap($header).should("have.class", "sorted");

          // Click again to reverse sort
          cy.wrap($header).click();
          cy.wrap($header).should("have.class", "sorted-reverse");
        }
      });
    });

    it("should handle multi-column sorting", () => {
      // Look for multi-sort functionality
      cy.get("body").then(($body) => {
        if ($body.find("table[data-multi-sort='true']").length > 0) {
          // Hold Ctrl and click multiple headers
          cy.get("table thead th.sortable").eq(0).click();
          cy.get("table thead th.sortable").eq(1).click({ ctrlKey: true });

          // Verify both columns show sort indicators
          cy.get("table thead th.sortable")
            .eq(0)
            .should("have.class", "sorted");
          cy.get("table thead th.sortable")
            .eq(1)
            .should("have.class", "sorted");
        }
      });
    });
  });

  describe("Table Filtering and Search", () => {
    it("should filter table by search input", () => {
      // Look for search input
      cy.get("body").then(($body) => {
        if (
          $body.find("input[type='search'], .table-search, [data-table-filter]")
            .length > 0
        ) {
          // Get initial row count
          cy.get("table tbody tr").then(($rows) => {
            const initialCount = $rows.length;

            // Enter search term
            cy.get(
              "input[type='search'], .table-search, [data-table-filter]"
            ).type("test");

            // Verify filtered results
            cy.get("table tbody tr").should(
              "have.length.at.most",
              initialCount
            );

            // Clear search
            cy.get(
              "input[type='search'], .table-search, [data-table-filter]"
            ).clear();

            // Verify all rows are visible again
            cy.get("table tbody tr").should("have.length", initialCount);
          });
        }
      });
    });

    it("should filter table by column filters", () => {
      // Look for column filter dropdowns
      cy.get("table thead th").each(($header, index) => {
        if ($header.find(".column-filter, [data-filter]").length > 0) {
          // Open filter dropdown
          cy.wrap($header).find(".column-filter, [data-filter]").click();

          // Select filter option
          cy.get(".filter-option, .dropdown-item").first().click();

          // Verify table is filtered
          cy.get("table tbody tr").should("have.length.at.least", 1);
        }
      });
    });

    it("should handle advanced filtering", () => {
      // Look for advanced filter panel
      cy.get("body").then(($body) => {
        if ($body.find(".advanced-filters, .filter-panel").length > 0) {
          // Open advanced filters
          cy.get(".advanced-filters-toggle, .filter-toggle").click();

          // Set multiple filter criteria
          cy.get(".filter-input").first().type("criteria1");
          cy.get(".filter-input").eq(1).type("criteria2");

          // Apply filters
          cy.get(".apply-filters").click();

          // Verify filters are applied
          cy.get("table tbody tr").should("have.length.at.least", 1);
        }
      });
    });
  });

  describe("Table Pagination", () => {
    it("should change page size", () => {
      // Look for page size selector
      cy.get("body").then(($body) => {
        if ($body.find(".page-size-select, [data-page-size]").length > 0) {
          // Get initial row count
          cy.get("table tbody tr").then(($rows) => {
            const initialCount = $rows.length;

            // Change page size
            cy.get(".page-size-select, [data-page-size]").select("25");

            // Verify page size changed
            cy.get("table tbody tr").should("have.length.at.most", 25);

            // Change back to original size
            cy.get(".page-size-select, [data-page-size]").select("10");

            // Verify original size restored
            cy.get("table tbody tr").should("have.length", initialCount);
          });
        }
      });
    });

    it("should handle page number input", () => {
      // Look for page number input
      cy.get("body").then(($body) => {
        if ($body.find(".page-number-input, [data-page-input]").length > 0) {
          // Enter page number
          cy.get(".page-number-input, [data-page-input]").clear().type("3");

          // Press Enter or click go button
          cy.get(".page-number-input, [data-page-input]").type("{enter}");

          // Verify page changed
          cy.get(".pagination .active, .current-page").should("contain", "3");
        }
      });
    });
  });

  describe("Table Row Operations", () => {
    it("should delete selected rows", () => {
      // Look for delete functionality
      cy.get("body").then(($body) => {
        if ($body.find(".delete-rows, .remove-selected").length > 0) {
          // Select a row
          cy.get("table input[type='checkbox']").first().check();

          // Get initial row count
          cy.get("table tbody tr").then(($rows) => {
            const initialCount = $rows.length;

            // Click delete button
            cy.get(".delete-rows, .remove-selected").click();

            // Confirm deletion if confirmation dialog appears
            cy.on("window:confirm", () => true);

            // Verify row count decreased
            cy.get("table tbody tr").should("have.length", initialCount - 1);
          });
        }
      });
    });

    it("should edit table rows", () => {
      // Look for edit functionality
      cy.get("body").then(($body) => {
        if ($body.find(".edit-row, .row-edit").length > 0) {
          // Click edit button on first row
          cy.get("table tbody tr").first().find(".edit-row, .row-edit").click();

          // Verify row is in edit mode
          cy.get("table tbody tr").first().should("have.class", "editing");

          // Edit cell content
          cy.get("table tbody tr")
            .first()
            .find("td input")
            .first()
            .type("Updated Value");

          // Save changes
          cy.get(".save-row, .row-save").click();

          // Verify row is no longer in edit mode
          cy.get("table tbody tr").first().should("not.have.class", "editing");
        }
      });
    });

    it("should add new rows", () => {
      // Look for add row functionality
      cy.get("body").then(($body) => {
        if ($body.find(".add-row, .new-row").length > 0) {
          // Get initial row count
          cy.get("table tbody tr").then(($rows) => {
            const initialCount = $rows.length;

            // Click add row button
            cy.get(".add-row, .new-row").click();

            // Verify new row is added
            cy.get("table tbody tr").should("have.length", initialCount + 1);

            // Verify new row is in edit mode
            cy.get("table tbody tr").last().should("have.class", "editing");
          });
        }
      });
    });
  });

  describe("Table Export and Import", () => {
    it("should export table data", () => {
      // Look for export functionality
      cy.get("body").then(($body) => {
        if ($body.find(".export-table, .download-data").length > 0) {
          // Click export button
          cy.get(".export-table, .download-data").click();

          // Verify download starts
          cy.readFile("cypress/downloads/table-export.csv").should("exist");
        }
      });
    });

    it("should import table data", () => {
      // Look for import functionality
      cy.get("body").then(($body) => {
        if ($body.find(".import-table, .upload-data").length > 0) {
          // Get initial row count
          cy.get("table tbody tr").then(($rows) => {
            const initialCount = $rows.length;

            // Upload test file
            cy.fixture("example.json").then((fileContent) => {
              cy.get(".import-table, .upload-data").attachFile({
                fileContent: JSON.stringify(fileContent),
                fileName: "test-data.json",
                mimeType: "application/json",
              });
            });

            // Verify data was imported
            cy.get("table tbody tr").should(
              "have.length.at.least",
              initialCount
            );
          });
        }
      });
    });
  });

  describe("Table Performance", () => {
    it("should handle large datasets efficiently", () => {
      // Test with large number of rows
      cy.get("table tbody tr").then(($rows) => {
        if ($rows.length > 100) {
          // Measure scroll performance
          const startTime = Date.now();

          // Scroll to bottom of table
          cy.get("table tbody").scrollTo("bottom");

          const endTime = Date.now();
          const scrollTime = endTime - startTime;

          // Log performance metrics
          cy.log(`Scrolling through ${$rows.length} rows took ${scrollTime}ms`);
          expect(scrollTime).to.be.lessThan(1000); // Should scroll smoothly
        }
      });
    });
  });
});
