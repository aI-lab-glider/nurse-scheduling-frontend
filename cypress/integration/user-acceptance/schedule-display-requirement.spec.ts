import { WorkerType } from "../../../src/common-models/worker-info.model";
import { ShiftCode } from "../../../src/common-models/shift-info.model";

context("Display schedule", () => {
  it("Should be able to load and display schedule", () => {
    cy.loadScheduleToMonth("example_2.xlsx");
    cy.get("[data-cy=nurseShiftsTable]", { timeout: 10000 }).should("exist");
  });

  it("Should be able to read month and year", () => {
    cy.get("#month-switch > span", { timeout: 100 });
    cy.contains("Listopad 2020");
  });

  it("Should be able to read holidays", () => {
    cy.get("#timetableRow > #weekendHeader").should("have.length", 10);
  });

  it("Should be able to read number of workers in 2nd, 15th and 28th November 2020", () => {
    cy.get("[data-cy=foundationInfoSection]")
      .children()
      .eq(0)
      .children()
      .eq(5 + 2)
      .contains(0);
    cy.get("[data-cy=foundationInfoSection]")
      .children()
      .eq(0)
      .children()
      .eq(5 + 15)
      .contains(0);
    cy.get("[data-cy=foundationInfoSection]")
      .children()
      .eq(0)
      .children()
      .eq(5 + 28)
      .contains(0);
  });

  it("Should be able to read number of children in 2nd, 15th and 28th November 2020", () => {
    cy.get("[data-cy=foundationInfoSection]")
      .children()
      .eq(1)
      .children()
      .eq(5 + 2)
      .contains(24);
    cy.get("[data-cy=foundationInfoSection]")
      .children()
      .eq(1)
      .children()
      .eq(5 + 15)
      .contains(24);
    cy.get("[data-cy=foundationInfoSection]")
      .children()
      .eq(1)
      .children()
      .eq(5 + 28)
      .contains(24);
  });

  it("Should be able to read name and surname of worker", () => {
    cy.get(".nametable").children().eq(0).children().eq(0).contains("pielęgniarka 1");

    cy.get(".nametable").children().eq(0).children().eq(4).contains("pielęgniarka 5");

    cy.get(".nametable").children().eq(1).children().eq(1).contains("opiekunka 10");

    cy.get(".nametable").children().eq(1).children().eq(8).contains("opiekunka 8");
  });

  const shiftCodes = [
    "W",
    "W",
    "W",
    "W",
    "W",
    "W",
    "W",
    "D",
    "R",
    "N",
    "W",
    "D",
    "W",
    "N",
    "W",
    "N",
    "W",
    "W",
    "W",
    "DN",
    "W",
    "N",
    "N",
    "N",
    "N",
    "W",
    "W",
    "D",
    "N",
    "N",
    "W",
    "W",
    "DN",
    "PN",
    "W",
    "DN",
    "W",
    "W",
    "W",
    "W",
    "W",
    "W",
  ];

  const WORKER = {
    workerType: WorkerType.NURSE,
    workerIdx: 1,
  };

  shiftCodes.forEach((k, index) => {
    it("Should be able to read shifts for workers", () => {
      cy.checkWorkerShift({ desiredShiftCode: k as ShiftCode, shiftIdx: index, ...WORKER });
    });
  });
});
