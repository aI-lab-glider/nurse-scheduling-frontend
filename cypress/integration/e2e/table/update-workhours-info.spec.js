/// <reference types="cypress" />

const initialWorkHours = { required: 136, actual: 164, overtime: 28 };

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
    cy.get("@requiredHours").contains(initialWorkHours.required);

    cy.get('[data-cy="summaryTable"]')
      .children()
      .children()
      .eq(0)
      .children()
      .eq(1)
      .as("actualHours");
    cy.get("@actualHours").contains(initialWorkHours.actual);

    cy.get('[data-cy="summaryTable"]')
      .children()
      .children()
      .eq(0)
      .children()
      .eq(2)
      .as("overtimeHours");
    cy.get("@overtimeHours").contains(initialWorkHours.overtime);
  });

  describe("When changing current month shift from U to DN", () => {
    beforeEach(() => {
      cy.get("#cyTestedSection").children().children().children().eq(4).as("currentMonthU");
      cy.get("@currentMonthU").contains("U");
      cy.get("@currentMonthU").click();
      cy.contains("dzień + noc").click();
      cy.get("#cyTestedSection").children().children().children().eq(4).contains("DN");
    });

    it("Should have the same number of required hours", () => {
      cy.get('[data-cy="summaryTable"]')
        .children()
        .children()
        .eq(0)
        .children()
        .eq(0)
        .contains(initialWorkHours.required);
    });

    it("Should add 24 hours to actual hours", () => {
      cy.get('[data-cy="summaryTable"]')
        .children()
        .children()
        .eq(0)
        .children()
        .eq(1)
        .contains(initialWorkHours.actual + 24);
    });

    it("Should add 24 hours to overtime hours", () => {
      cy.get('[data-cy="summaryTable"]')
        .children()
        .children()
        .eq(0)
        .children()
        .eq(2)
        .contains(initialWorkHours.overtime + 24);
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
      cy.get('[data-cy="summaryTable"]')
        .children()
        .children()
        .eq(0)
        .children()
        .eq(0)
        .contains(initialWorkHours.required);
    });

    it("Should not change the number of actual hours", () => {
      cy.get('[data-cy="summaryTable"]')
        .children()
        .children()
        .eq(0)
        .children()
        .eq(1)
        .contains(initialWorkHours.actual);
    });

    it("Should not change the number of overtime hours", () => {
      cy.get('[data-cy="summaryTable"]')
        .children()
        .children()
        .eq(0)
        .children()
        .eq(2)
        .contains(initialWorkHours.overtime);
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
      cy.get('[data-cy="summaryTable"]')
        .children()
        .children()
        .eq(0)
        .children()
        .eq(0)
        .contains(initialWorkHours.required);
    });

    it("Should subtract 12 hours from actual hours", () => {
      cy.get('[data-cy="summaryTable"]')
        .children()
        .children()
        .eq(0)
        .children()
        .eq(1)
        .contains(initialWorkHours.actual - 12);
    });

    it("Should subtract 12 hours from overtime hours", () => {
      cy.get('[data-cy="summaryTable"]')
        .children()
        .children()
        .eq(0)
        .children()
        .eq(2)
        .contains(initialWorkHours.overtime - 12);
    });
  });
});
