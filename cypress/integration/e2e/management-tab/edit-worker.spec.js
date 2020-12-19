/// <reference types="cypress" />

context("Tab 'zarządzanie'", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Zarządzanie").click();
    cy.contains("opiekunka 1").parent().contains("Edytuj").click();
  });

  describe("Edit worker", () => {
    it("Should be able to close edit drawer", () => {
      cy.contains("Edycja pracownika").should("be.visible");
      cy.get('[data-cy="exit-drawer"]').click();
      cy.contains("Edycja pracownika").should("be.not.visible");
    });

    it.only("Should be able to edit the name", () => {
      cy.contains("Nazwa");
    });
  });
});
