context("Menu 'plik'", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
  });

  describe("File button", () => {
    it("Should open options menu", () => {
      cy.get("[data-cy=file-dropdown]").click();
      cy.get("[data-cy=load-schedule-button]");
      cy.get("[data-cy=export-schedule-button]");
    });
  });

  describe("Load schedule", () => {
    it("Should be able to load and show the schedule", () => {
      cy.loadSchedule();
      cy.contains("Pielęgniarki");
    });
  });
});
