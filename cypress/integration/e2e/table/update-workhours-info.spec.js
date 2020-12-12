/* eslint-disable @typescript-eslint/explicit-function-return-type */
/// <reference types="cypress" />

const nurseInitialWorkHours = { required: 136, actual: 164, overtime: 28 };
const babysitterInitialWorkHours = { required: 80, actual: 108, overtime: 28 };

function requiredHoursCell(workerType) {
  if (workerType === "nurse") {
    return cy.get('[data-cy="nurseSummaryTable"]').children().children().eq(0).children().eq(0);
  }
  if (workerType === "babysitter") {
    return cy
      .get('[data-cy="babysitterSummaryTable"]')
      .children()
      .children()
      .eq(3)
      .children()
      .eq(0);
  }
}

function actualHoursCell(workerType) {
  if (workerType === "nurse") {
    return cy.get('[data-cy="nurseSummaryTable"]').children().children().eq(0).children().eq(1);
  }
  if (workerType === "babysitter") {
    return cy
      .get('[data-cy="babysitterSummaryTable"]')
      .children()
      .children()
      .eq(3)
      .children()
      .eq(1);
  }
}
function overtimeHoursCell(workerType) {
  if (workerType === "nurse") {
    return cy.get('[data-cy="nurseSummaryTable"]').children().children().eq(0).children().eq(2);
  }
  if (workerType === "babysitter") {
    return cy
      .get('[data-cy="babysitterSummaryTable"]')
      .children()
      .children()
      .eq(3)
      .children()
      .eq(2);
  }
}

context("Work hours info (summary table)", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.contains("Plik").click();
    cy.get('[data-cy="file-input"]').attachFile("example.xlsx");

    // doublecheck if initial conditions are as expected
    requiredHoursCell("nurse").contains(nurseInitialWorkHours.required);
    actualHoursCell("nurse").contains(nurseInitialWorkHours.actual);
    overtimeHoursCell("nurse").contains(nurseInitialWorkHours.overtime);

    requiredHoursCell("babysitter").contains(babysitterInitialWorkHours.required);
    actualHoursCell("babysitter").contains(babysitterInitialWorkHours.actual);
    overtimeHoursCell("babysitter").contains(babysitterInitialWorkHours.overtime);
  });

  describe("For a nurse", () => {
    describe("When changing current month shift from U to DN", () => {
      beforeEach(() => {
        cy.get("[data-cy=nurseShiftsTable]")
          .children()
          .children()
          .children()
          .eq(4)
          .as("currentMonthU");
        cy.get("@currentMonthU").contains("U");
        cy.get("@currentMonthU").click();
        cy.contains("dzień + noc").click();
        cy.get("[data-cy=nurseShiftsTable]").children().children().children().eq(4).contains("DN");
      });

      it("Should not change the number of required hours", () => {
        requiredHoursCell("nurse").contains(nurseInitialWorkHours.required);
      });

      it("Should add 24 hours to actual hours", () => {
        actualHoursCell("nurse").contains(nurseInitialWorkHours.actual + 24);
      });

      it("Should add 24 hours to overtime hours", () => {
        overtimeHoursCell("nurse").contains(nurseInitialWorkHours.overtime + 24);
      });
    });

    describe("When changing previous month shift from DN to U", () => {
      beforeEach(() => {
        cy.get("[data-cy=nurseShiftsTable]")
          .children()
          .children()
          .children()
          .eq(0)
          .as("previousMonthDN");
        cy.get("@previousMonthDN").contains("DN");
        cy.get("@previousMonthDN").click();
        cy.contains("urlop").click();
        cy.get("[data-cy=nurseShiftsTable]").children().children().children().eq(0).contains("U");
      });

      it("Should not change the number of required hours", () => {
        requiredHoursCell("nurse").contains(nurseInitialWorkHours.required);
      });

      it("Should not change the number of actual hours", () => {
        actualHoursCell("nurse").contains(nurseInitialWorkHours.actual);
      });

      it("Should not change the number of overtime hours", () => {
        overtimeHoursCell("nurse").contains(nurseInitialWorkHours.overtime);
      });
    });

    describe("When changing current month shift from DN to N", () => {
      beforeEach(() => {
        cy.get("[data-cy=nurseShiftsTable]")
          .children()
          .children()
          .children()
          .eq(16)
          .as("currentMonthDN");
        cy.get("@currentMonthDN").contains("DN");
        cy.get("@currentMonthDN").click();
        cy.contains("noc").click();
        cy.get("[data-cy=nurseShiftsTable]").children().children().children().eq(16).contains("N");
      });

      it("Should not change the number of required hours", () => {
        requiredHoursCell("nurse").contains(nurseInitialWorkHours.required);
      });

      it("Should subtract 12 hours from actual hours", () => {
        actualHoursCell("nurse").contains(nurseInitialWorkHours.actual - 12);
      });

      it("Should subtract 12 hours from overtime hours", () => {
        overtimeHoursCell("nurse").contains(nurseInitialWorkHours.overtime - 12);
      });
    });
  });

  describe("For a babysitter", () => {
    describe("When changing current month shift from U to DN", () => {
      beforeEach(() => {
        cy.get("[data-cy=babysitterShiftsTable]")
          .children()
          .eq(3)
          .children()
          .eq(9)
          .children()
          .as("currentMonthU");
        cy.get("@currentMonthU").contains("U");
        cy.get("@currentMonthU").click();
        cy.contains("dzień + noc").click();
        cy.get("[data-cy=babysitterShiftsTable]")
          .children()
          .eq(3)
          .children()
          .eq(9)
          .children()
          .contains("DN");
      });
      it("Should not change the number of required hours", () => {
        requiredHoursCell("babysitter").contains(babysitterInitialWorkHours.required);
      });

      it("Should add 24 to the number of actual hours", () => {
        actualHoursCell("babysitter").contains(babysitterInitialWorkHours.actual + 24);
      });

      it("Should add 24 to the number of overtime hours", () => {
        overtimeHoursCell("babysitter").contains(babysitterInitialWorkHours.overtime + 24);
      });
    });

    describe("When changing previous month shift from DN to U", () => {
      beforeEach(() => {
        cy.get("[data-cy=babysitterShiftsTable]")
          .children()
          .eq(3)
          .children()
          .eq(3)
          .children()
          .as("previousMonthDN");
        cy.get("@previousMonthDN").contains("DN");
        cy.get("@previousMonthDN").click();
        cy.contains("noc").click();
        cy.get("[data-cy=babysitterShiftsTable]")
          .children()
          .eq(3)
          .children()
          .eq(3)
          .children()
          .contains("N");
      });
      it("Should not change the number of required hours", () => {
        requiredHoursCell("babysitter").contains(babysitterInitialWorkHours.required);
      });

      it("Should not change the number of actual hours", () => {
        actualHoursCell("babysitter").contains(babysitterInitialWorkHours.actual);
      });

      it("Should not change the number of overtime hours", () => {
        overtimeHoursCell("babysitter").contains(babysitterInitialWorkHours.overtime);
      });
    });

    describe("When changing current month shift from DN to N", () => {
      beforeEach(() => {
        cy.get("[data-cy=babysitterShiftsTable]")
          .children()
          .eq(3)
          .children()
          .eq(30)
          .children()
          .as("currentMonthDN");
        cy.get("@currentMonthDN").contains("DN");
        cy.get("@currentMonthDN").click();
        cy.contains("noc").click();
        cy.get("[data-cy=babysitterShiftsTable]")
          .children()
          .eq(3)
          .children()
          .eq(30)
          .children()
          .contains("N");
      });
      it("Should not change the number of required hours", () => {
        requiredHoursCell("babysitter").contains(babysitterInitialWorkHours.required);
      });

      it("Should subtract 12 from the number of actual hours", () => {
        actualHoursCell("babysitter").contains(babysitterInitialWorkHours.actual + 12);
      });

      it("Should subtract 12 from the number of overtime hours", () => {
        overtimeHoursCell("babysitter").contains(babysitterInitialWorkHours.overtime + 12);
      });
    });
  });
});
