/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import "cypress-file-upload";
import { ShiftCode } from "../../src/common-models/shift-info.model";
import { WorkerType } from "../../src/common-models/worker-info.model";

export type CypressScreenshotOptions = Partial<
  Cypress.Loggable & Cypress.Timeoutable & Cypress.ScreenshotOptions
>;

export interface GetWorkerShiftOptions {
  workerType: WorkerType;
  workerIdx: number;
  shiftIdx: number;
  selector?: "cell" | "highlighted-cell";
}

export interface CheckWorkerShiftOptions extends GetWorkerShiftOptions {
  desiredShiftCode: ShiftCode;
}
export interface ChangeWorkerShiftOptions extends GetWorkerShiftOptions {
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
export type ScheduleName = "example.xlsx" | "grafik.xlsx" | "example_2.xlsx";

Cypress.Commands.add("loadSchedule", (scheduleName: ScheduleName = "example.xlsx") => {
  cy.visit(Cypress.env("baseUrl"));
  cy.get("[data-cy=file-dropdown]").click();
  cy.get('[data-cy="file-input"]').attachFile(scheduleName);
  cy.get(`[data-cy=nurseShiftsTable]`, { timeout: 10000 });
  cy.window()
    .its("store")
    .invoke("getState")
    .its("actualState")
    .its("temporarySchedule")
    .its("present")
    .its("month_info")
    .its("children_number")
    .should("have.length", 35);
});

Cypress.Commands.add(
  "getWorkerShift",
  ({ workerType, workerIdx, shiftIdx, selector = "cell" }: GetWorkerShiftOptions) => {
    return cy
      .get(`[data-cy=${workerType.toLowerCase()}ShiftsTable]`)
      .children()
      .children()
      .eq(workerIdx)
      .children()
      .eq(shiftIdx)
      .find(`[data-cy=${selector}]`);
  }
);

Cypress.Commands.add(
  "checkWorkerShift",
  ({ desiredShiftCode, ...getWorkerShiftOptions }: CheckWorkerShiftOptions) => {
    if (desiredShiftCode === ShiftCode.W) {
      return cy.getWorkerShift(getWorkerShiftOptions).should("be.empty");
    } else {
      return cy.getWorkerShift(getWorkerShiftOptions).contains(desiredShiftCode);
    }
  }
);

Cypress.Commands.add("useAutocomplete", (newShiftCode: ShiftCode) => {
  return cy
    .get(`[data-cy=autocomplete-${newShiftCode}]`, { timeout: 100000 })
    .click({ force: true });
});

Cypress.Commands.add(
  "changeWorkerShift",
  ({ newShiftCode, ...getWorkerShiftOptions }: ChangeWorkerShiftOptions) => {
    cy.getWorkerShift(getWorkerShiftOptions).click();
    return cy.useAutocomplete(newShiftCode);
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

Cypress.Commands.add("saveToDatabase", () => {
  return cy.get("[data-cy=save-schedule-button").click();
});

Cypress.Commands.add("enterEditMode", () => {
  cy.get("[data-cy=edit-mode-button]").click();
  return cy.get("[data-cy=nurseShiftsTable]", { timeout: 10000 });
});

Cypress.Commands.add("leaveEditMode", () => {
  cy.get("[data-cy=leave-edit-mode]").click();
  return cy.get("[data-cy=nurseShiftsTable]", { timeout: 10000 });
});

Cypress.Commands.add(
  "screenshotSync",
  (awaitTime = 200, cyScreenshotOptions?: CypressScreenshotOptions) => {
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    return cy.screenshot(cyScreenshotOptions).wait(awaitTime);
  }
);
