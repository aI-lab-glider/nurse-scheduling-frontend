/// <reference types="cypress" />

context("Work hours info (summary table)", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
  });

  // zmiana w tym miesiącu na większą zmianę dodaje godziny
  // zmiana w zeszłym miesiącu nie wpływa na nic
  // zmiana w tym miesiącu na mniejszą odejmuje

  // required, actual, overtime

  describe("When changing current month shift from U to DN", () => {
    beforeEach(() => {
      cy.get("#cyTestedSection").children().children().children().eq(4).as("cell");
      cy.get("@cell").contains("U");
      cy.get("@cell").click();
      cy.contains("dzień + noc").click();
      cy.get("#cyTestedSection").children().children().children().eq(0).contains("DN");
    });

    it("Should have the same number of required hours", () => {
      cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(0).contains(136);
    });

    it("Should add 24 hours to actual hours", () => {
      cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(1).contains(188);
    });

    it("Should add 24 hours to overtime hours", () => {
      cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(2).contains(52);
    });
  });
});
