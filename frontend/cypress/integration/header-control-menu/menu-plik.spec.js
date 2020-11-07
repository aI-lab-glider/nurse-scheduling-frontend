/// <reference types="cypress" />

context("Menu 'plik'", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("baseUrl")}`);
  });

  describe("File button", () => {
    it("Should open options menu", () => {
      cy.contains("Plik").click();
      cy.contains("Wczytaj");
      cy.contains("Zapisz jako...");
    });
  });

  describe("Test should fail and block PR", () => {
    it("Should faile", () =>  {
      cy.contains("Not existing button");
    })
  })
});
