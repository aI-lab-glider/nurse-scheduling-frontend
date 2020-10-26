/// <reference types="cypress" />

context("Example", () => {
  beforeEach(() => {
    cy.visit("localhost:3002");
  });

  describe("File button", () => {
    it("Should open options menu", () => {
      cy.contains("Plik").click();
      cy.contains("Wczytaj");
      cy.contains("Zapisz jako...");
    });
  });
});
