/// <reference types="cypress" />

context("Tab 'zarządzanie'", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("" + "example.xlsx");
    cy.contains("Zarządzanie").click();
    cy.contains("opiekunka 1").parent().contains("Edytuj").click();
  });

  describe("Edit worker", () => {
    it("Should be able to close edit drawer", () => {
      cy.contains("Edycja pracownika").should("be.visible");
      cy.get('[data-cy="exit-drawer"]').click();
      cy.contains("Edycja pracownika").should("be.not.visible");
    });

    it("Should be able to edit the name", () => {
      cy.contains("opiekunka 1").get("input").clear().type("Ala Makota");
      cy.get('[value="Ala Makota"]').should("be.visible");
    });

    it("Should be able to edit the position", () => {
      cy.get(".btn-outlined").contains("Opiekunka").click();
      cy.get(".btn-primary").contains("Pielęgniarka").click();
      cy.get(".btn-outlined").contains("Pielęgniarka");
    });

    context("Editing the time", () => {
      beforeEach(() => {
        cy.get(".btn-outlined").contains("Typ umowy").click();
      });

      it("Should properly render conditional sections", () => {
        cy.get(".btn-primary").contains("Umowa o pracę").click();
        cy.get(".btn-outlined").contains("Umowa o pracę");
        cy.contains("Wpisz wymiar etatu");
        cy.get(".btn-primary").contains("Umowa zlecenie").click();
        cy.get(".btn-outlined").contains("Umowa zlecenie");
        cy.contains("Ilość godzin");
      });

      it("Should properly handle number of hours when employment contract", () => {
        cy.get(".btn-primary").contains("Umowa o pracę").click();
        cy.get('[data-cy="civilTime"] input').clear({ force: true }).type("123");
        cy.get(".btn-outlined").contains("Opiekunka").click(); // unclick
        cy.get('[value="123"]').should("be.visible");
      });
    });
  });
});
