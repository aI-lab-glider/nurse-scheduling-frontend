/* eslint-disable @typescript-eslint/explicit-function-return-type */
/// <reference types="cypress" />

const initialWorkHours = { required: 136, actual: 164, overtime: 28 };

function requiredHoursCell() {
  return cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(0);
}

function actualHoursCell() {
  return cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(1);
}
function overtimeHoursCell() {
  return cy.get('[data-cy="summaryTable"]').children().children().eq(0).children().eq(2);
}

context("Work hours info (summary table)", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");

    // doublecheck if initial conditions are as expected
    requiredHoursCell().contains(initialWorkHours.required);
    actualHoursCell().contains(initialWorkHours.actual);
    overtimeHoursCell().contains(initialWorkHours.overtime);
  });

  describe("When changing current month shift from U to DN", () => {
    beforeEach(() => {
      cy.get("#cyTestedSection").children().children().children().eq(4).as("currentMonthU");
      cy.get("@currentMonthU").contains("U");
      cy.get("@currentMonthU").click();
      cy.contains("dzień + noc").click();
      cy.get("#cyTestedSection").children().children().children().eq(4).contains("DN");
    });

    it("Should not change the number of required hours", () => {
      requiredHoursCell().contains(initialWorkHours.required);
    });

    it("Should add 24 hours to actual hours", () => {
      actualHoursCell().contains(initialWorkHours.actual + 24);
    });

    it("Should add 24 hours to overtime hours", () => {
      overtimeHoursCell().contains(initialWorkHours.overtime + 24);
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

    it("Should not change the number of required hours", () => {
      requiredHoursCell().contains(initialWorkHours.required);
    });

    it("Should not change the number of actual hours", () => {
      actualHoursCell().contains(initialWorkHours.actual);
    });

    it("Should not change the number of overtime hours", () => {
      overtimeHoursCell().contains(initialWorkHours.overtime);
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

    it("Should not change the number of required hours", () => {
      requiredHoursCell().contains(initialWorkHours.required);
    });

    it("Should subtract 12 hours from actual hours", () => {
      actualHoursCell().contains(initialWorkHours.actual - 12);
    });

    it("Should subtract 12 hours from overtime hours", () => {
      overtimeHoursCell().contains(initialWorkHours.overtime - 12);
    });
  });
});
