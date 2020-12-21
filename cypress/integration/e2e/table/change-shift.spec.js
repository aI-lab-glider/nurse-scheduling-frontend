/// <reference types="cypress" />

context("Change shift", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
    cy.get("#cyTestedSection").children().children().children().eq(0).as("cell");
    cy.get("@cell").contains("DN");
  });

  it("Should be able to change shift using dropdown", () => {
    cy.get("@cell").click();
    cy.contains("Popołudnie").click();

    // https://github.com/cypress-io/cypress/issues/7413
    cy.get("#cyTestedSection").children().children().children().eq(0).contains("P");
  });
});
