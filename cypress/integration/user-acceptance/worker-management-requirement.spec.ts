context("Worker management", () => {
  it("Should be able to switch from main page to worker management page", () => {
    cy.visit(Cypress.env("baseUrl"));
    cy.get(".MuiTabs-flexContainer").children().eq(1).click();
    cy.get(".management-page", { timeout: 100 }).should("exist");
  });
});
