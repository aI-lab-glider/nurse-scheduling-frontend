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

  describe("Load schedule", () => {
    it("Should be able to load and show the schedule", () => {
      cy.contains("Plik").click();
      cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
      cy.contains("Dni miesiąca");
    });
  });
});
