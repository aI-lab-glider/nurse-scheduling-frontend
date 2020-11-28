/// <reference types="cypress" />

context("Change shift", () => {
  beforeEach(() => {
    cy.visit(`http://localhost:3000/`);
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
    cy.contains("pielęgniarka 1").parent().parent().children('td[class="cell"]').eq(1).as("cell");
    cy.get("@cell").contains("DN");
  });

  it("Should be able to change shift using dropdown", () => {
    cy.get("@cell").click();
    cy.contains("rano").click();

    // https://github.com/cypress-io/cypress/issues/7413
    cy.contains("pielęgniarka 1")
      .parent()
      .parent()
      .children('td[class="cell"]')
      .eq(1)
      .contains("R");
  });

  it("Should be able to change shift using keyboard", () => {
    cy.get("@cell").click().type("R{enter}");

    // https://github.com/cypress-io/cypress/issues/7413
    cy.contains("pielęgniarka 1")
      .parent()
      .parent()
      .children('td[class="cell"]')
      .eq(1)
      .contains("R");
  });
});
