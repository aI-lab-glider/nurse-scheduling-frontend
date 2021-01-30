describe("schedule import and export requirement", () => {
  it("shows how to import schedule", () => {
    cy.visit(Cypress.env("baseUrl")).screenshotSync();
    cy.get("[data-cy=file-dropdown]").click().screenshotSync();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
    cy.get(`[data-cy=nurseShiftsTable]`, { timeout: 10000 }).screenshotSync();
  });
});
