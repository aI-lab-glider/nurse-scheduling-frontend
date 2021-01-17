import { WorkerType } from "../../../src/common-models/worker-info.model";
import { ShiftCode } from "../../../src/common-models/shift-info.model";
import { useActualMonth } from "../../../src/components/common-components/month-switch/use-actual-month";
import { CheckWorkerShiftOptions } from "../../support/commands";

context("Display schedule", () => {
  it("Should be able to load and display schedule", () => {
    // cy.visit(Cypress.env("baseUrl"));
    cy.loadSchedule("example_2.xlsx");
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
    cy.get("[data-cy=foundationInfoSection]").children().eq(0).children().eq(5).contains(0);
    cy.get("[data-cy=foundationInfoSection]").children().eq(0).children().eq(18).contains(0);
    cy.get("[data-cy=foundationInfoSection]").children().eq(0).children().eq(31).contains(0);
  });

  it("Should be able to read number of wards of children in 2nd, 15th and 28th November 2020", () => {
    cy.get("[data-cy=foundationInfoSection]").children().eq(1).children().eq(5).contains(24);
    cy.get("[data-cy=foundationInfoSection]").children().eq(1).children().eq(18).contains(24);
    cy.get("[data-cy=foundationInfoSection]").children().eq(1).children().eq(31).contains(24);
  });

  it("Should be able to read name and surname of worker", () => {
    cy.get(".nametable").children().eq(0).children().eq(0).contains("pielęgniarka 1");

    cy.get(".nametable").children().eq(0).children().eq(4).contains("pielęgniarka 5");

    cy.get(".nametable").children().eq(1).children().eq(1).contains("opiekunka 10");

    cy.get(".nametable").children().eq(1).children().eq(8).contains("opiekunka 8");
  });

  it("Should be able to read name and surname of worker", () => {
    cy.get(".nametable").children().eq(0).children().eq(0).contains("pielęgniarka 1");
  });

  const shiftCodes = [
    "PN",
    "W",
    "W",
    "DN",
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