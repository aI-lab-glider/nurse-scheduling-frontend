/// <reference types="cypress" />

context("Work hours info (summary table)", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");

    // doublecheck if initial conditions are as expected
    cy.get('[data-cy="summaryTable"]')
      .children()
      .children()
      .eq(0)
      .children()
      .eq(0)
      .as("requiredHours");
    cy.get("@requiredHours").contains(136);

    cy.get('[data-cy="summaryTable"]')
      .children()
      .children()
      .eq(0)
      .children()
      .eq(1)
      .as("actualHours");
    cy.get("@actualHours").contains(164);

    cy.get('[data-cy="summaryTable"]')
      .children()
      .children()
      .eq(0)
      .children()
      .eq(2)
      .as("overtimeHours");
    cy.get("@overtimeHours").contains(28);
  });

  // zmiana w tym miesiącu na większą zmianę dodaje godziny
  // zmiana w zeszłym miesiącu nie wpływa na nic
  // zmiana w tym miesiącu na mniejszą odejmuje

  // required, actual, overtime

  describe("When changing current month shift from U to DN", () => {
    beforeEach(() => {
      cy.get("#cyTestedSection").children().children().children().eq(4).as("currentMonthU");
      cy.get("@currentMonthU").contains("U");
      cy.get("@currentMonthU").click();
      cy.contains("dzień + noc").click();
      cy.get("#cyTestedSection").children().children().children().eq(4).contains("DN");
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

  describe("When changing previous month shift from DN to U", () => {
    beforeEach(() => {
      cy.get("#cyTestedSection").children().children().children().eq(0).as("previousMonthDN");
      cy.get("@previousMonthDN").contains("DN");
      cy.get("@previousMonthDN").click();
      cy.contains("urlop").click();
      cy.get("#cyTestedSection").children().children().children().eq(0).contains("U");
    });

    it("Should have the same number of required hours", () => {
      cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(0).contains(136);
    });

    it("Should not change the number of actual hours", () => {
      cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(1).contains(164);
    });

    it("Should not change the number of overtime hours", () => {
      cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(2).contains(28);
    });
  });

  describe("When changing current month shift from DN to N", () => {
    beforeEach(() => {
      cy.get("#cyTestedSection").children().children().children().eq(16).as("currentMonthDN");
      cy.get("@currentMonthDN").contains("DN");
      cy.get("@currentMonthDN").click();
      cy.contains("noc").click();
      cy.get("#cyTestedSection").children().children().children().eq(16).contains("N");
    });

    it("Should have the same number of required hours", () => {
      cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(0).contains(136);
    });

    it("Should subtract 12 hours from actual hours", () => {
      cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(1).contains(152);
    });

    it("Should subtract 12 hours from overtime hours", () => {
      cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(2).contains(16);
    });
  });
});
