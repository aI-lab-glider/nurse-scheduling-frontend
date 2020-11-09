/// <reference types="cypress" />
const fs = require("fs");

context("Menu 'plik'", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("baseUrl")}`);
    cy.contains("Plik").click();
  });

  describe("File button", () => {
    it("Should open options menu", () => {
      cy.contains("Wczytaj");
      cy.contains("Zapisz jako...");
    });
  });

  describe("Load schedule", () => {
    it("Should be able to load and show the schedule", () => {
      cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
      cy.contains("Dni miesiąca");
    });
  });

  describe("Export schedule and load exported", () => {
    it("Should be able to export and load exported schedule", () => {
      cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
      cy.contains("Zapisz jako...").click();
      cy.exec('whoami').then((result) => {
        const user = result.stdout;
        cy.readFile(`/Users/${user}/Downloads/grafik.xlsx`).then((file) =>{
          cy.writeFile("./cypress/fixtures/grafik.xlsx", file);
        });
      })
      cy.contains("28").click();
      cy.get('[class="cell-input"').type("1");
      cy.contains("Plik").click();
      cy.get('[data-cy="file-input"]').attachFile("grafik.xlsx");
      cy.contains("Dni miesiąca");
    });
  });
});
