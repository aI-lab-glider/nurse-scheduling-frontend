import "cypress-file-upload";
import { WorkerType } from "../../src/common-models/worker-info.model";
import { ShiftCode } from "../../src/common-models/shift-info.model";

export interface GetWorkerShiftOptions {
  workerType: WorkerType;
  workerIdx: number;
  shiftIdx: number;
}

export interface ChangeWorkerShiftOptions {
  workerType: WorkerType;
  workerIdx: number;
  shiftIdx: number;
  newShiftCode: ShiftCode;
}

export interface CheckHoursInfoOptions {
  workerType: WorkerType;
  workerIdx: number;
  hoursInfo: HoursInfo;
}

export type HoursInfo = {
  [key in HoursInfoCells]: number;
};

export enum HoursInfoCells {
  required = 0,
  actual = 1,
  overtime = 2,
}

Cypress.Commands.add("loadSchedule", () => {
  cy.visit(Cypress.env("baseUrl"));
  cy.get("[data-cy=file-dropdown]").click();
  cy.get('[data-cy="file-input"]').attachFile("example.xlsx");
  cy.get(`[data-cy=nurseShiftsTable]`, { timeout: 10000 });
  cy.window()
    .its("store")
    .invoke("getState")
    .its("scheduleData")
    .its("present")
    .its("month_info")
    .its("children_number")
    .should("have.length", 35);
});

Cypress.Commands.add(
  "getWorkerShift",
  ({ workerType, workerIdx, shiftIdx }: GetWorkerShiftOptions) => {
    return cy
      .get(`[data-cy=${workerType.toLowerCase()}ShiftsTable]`)
      .children()
      .children()
      .eq(workerIdx)
      .children()
      .eq(shiftIdx)
      .children()
      .children();
  }
);

Cypress.Commands.add(
  "changeWorkerShift",
  ({ workerType, workerIdx, shiftIdx, newShiftCode }: ChangeWorkerShiftOptions) => {
    cy.getWorkerShift({ workerType, workerIdx, shiftIdx }).click();
    return cy.get(`[data-cy=autocomplete-${newShiftCode}]`, { timeout: 100000 }).click();
  }
);

Cypress.Commands.add(
  "checkHoursInfo",
  ({ workerType, workerIdx, hoursInfo }: CheckHoursInfoOptions) => {
    Object.keys(HoursInfoCells)
      .filter((key) => isNaN(Number(HoursInfoCells[key])))
      .forEach((key) => {
        cy.get(`[data-cy="${workerType.toLowerCase()}SummaryTable"]`)
          .children()
          .children()
          .eq(workerIdx)
          .children()
          .eq(Number(key))
          .contains(hoursInfo[key]);
      });
  }
);
