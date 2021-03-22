/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import "cypress-file-upload";
import { ShiftCode } from "../../src/common-models/shift-info.model";
import { WorkerType } from "../../src/common-models/worker-info.model";
import {
  baseCellDataCy,
  CellType,
} from "../../src/components/schedule-page/table/schedule/schedule-parts/base-cell/base-cell.models";
import { baseRowDataCy } from "../../src/components/schedule-page/table/schedule/schedule-parts/base-row.models";
import { summaryCellDataCy } from "../../src/components/summarytable/summarytable-cell.models";
import { summaryRowDataCy } from "../../src/components/summarytable/summarytable-row.models";
import { LocalStorageProvider } from "../../src/api/local-storage-provider.model";
import { MonthHelper, NUMBER_OF_DAYS_IN_WEEK } from "../../src/helpers/month.helper";

export type CypressScreenshotOptions = Partial<
  Cypress.Loggable & Cypress.Timeoutable & Cypress.ScreenshotOptions
>;

export interface GetWorkerShiftOptions {
  workerType: WorkerType;
  workerIdx: number;
  shiftIdx: number;
  selector?: CellType;
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
export type ScheduleName =
  | "example.xlsx"
  | "example_2.xlsx"
  | "childrens_extraworkers.xlsx"
  | "extraworkers_childrens.xlsx";
const TEST_SCHEDULE_MONTH = 10;
const TEST_SCHEDULE_YEAR = 2020;

Cypress.Commands.add(
  "loadScheduleToMonth",
  (scheduleName: ScheduleName = "example.xlsx", month: number, year: number) => {
    new LocalStorageProvider().reloadDb();
    cy.clock(Date.UTC(year ?? TEST_SCHEDULE_YEAR, month ?? TEST_SCHEDULE_MONTH, 15), ["Date"]);
    cy.visit(Cypress.env("baseUrl"));
    cy.get("[data-cy=file-input]").should("exist");
    cy.get("[data-cy=file-input]").attachFile(scheduleName);
    cy.get(`[data-cy=nurseShiftsTable]`).should("exist");
    cy.window()
      .its("store")
      .invoke("getState")
      .its("actualState.temporarySchedule.present.month_info.children_number")
      .should(
        "have.length",
        MonthHelper.numberOfWeeksInMonth(month ?? TEST_SCHEDULE_MONTH, year ?? TEST_SCHEDULE_YEAR) *
          NUMBER_OF_DAYS_IN_WEEK
      );
  }
);

Cypress.Commands.add(
  "getWorkerShift",
  ({ workerType, workerIdx, shiftIdx, selector = "cell" }: GetWorkerShiftOptions) => {
    const section = `${workerType.toLowerCase()}ShiftsTable`;
    const row = baseRowDataCy(workerIdx);
    const cell = baseCellDataCy(shiftIdx, selector);
    return cy.get(`[data-cy=${section}] [data-cy=${row}] [data-cy=${cell}]`);
  }
);

Cypress.Commands.add(
  "checkWorkerShift",
  ({ desiredShiftCode, ...getWorkerShiftOptions }: CheckWorkerShiftOptions) => {
    if (desiredShiftCode === ShiftCode.W) {
      return cy.getWorkerShift(getWorkerShiftOptions).should("be.empty");
    } else {
      return cy.getWorkerShift(getWorkerShiftOptions).should("contain", desiredShiftCode);
    }
  }
);

Cypress.Commands.add("useAutocomplete", (newShiftCode: ShiftCode) => {
  return cy.get(`[data-cy=autocomplete-${newShiftCode}]`).should("exist").click({ force: true });
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
    const section = `${workerType.toLowerCase()}SummaryTable`;
    const row = summaryRowDataCy(workerIdx);
    Object.keys(HoursInfoCells)
      .filter((key) => isNaN(Number(HoursInfoCells[key])))
      .forEach((key) => {
        const cell = summaryCellDataCy(parseInt(key));
        cy.get(`[data-cy=${section}] [data-cy=${row}] [data-cy=${cell}]`).should(
          "contain",
          hoursInfo[key]
        );
      });
  }
);

Cypress.Commands.add("saveToDatabase", () => {
  return cy.get("[data-cy=save-schedule-button").click();
});

Cypress.Commands.add("enterEditMode", () => {
  // TODO: uncomment and check if everything would work after TASK-180 would be merged
  const actualRevisionValue = "actual";
  cy.get("[data-cy=revision-select]")
    //   .select(RevisionTypeLabels[actualRevisionValue])
    .should("have.value", actualRevisionValue);
  // cy.get("[data-cy=revision-select]").blur();
  cy.get("[data-cy=edit-mode-button]").click();
  return cy.get("[data-cy=nurseShiftsTable]").should("exist");
});

Cypress.Commands.add("leaveEditMode", () => {
  cy.get("[data-cy=leave-edit-mode]").click();
  return cy.get("[data-cy=nurseShiftsTable]").should("exist");
});

Cypress.Commands.add(
  "screenshotSync",
  (awaitTime = 100, cyScreenshotOptions?: CypressScreenshotOptions) => {
    // In case if screenshots are disabled, just return `cy`, so command is still chainable
    if (Cypress.env("makeScreenshots") !== "true") {
      return cy;
    }
    cy.get("#header").invoke("css", "position", "absolute");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.screenshot(cyScreenshotOptions).wait(awaitTime);
    return cy.get("#header").invoke("css", "position", null);
  }
);

export enum FoundationInfoRowType {
  ExtraWorkersRow = 0,
  ChildrenInfoRow = 1,
  NurseCountRow = 2,
  BabysitterCountRow = 3,
}
export interface GetFoundationInfoCellOptions {
  rowType: FoundationInfoRowType;
  cellIdx: number;
  actualValue: number;
}
Cypress.Commands.add(
  "getFoundationInfoCell",
  ({ cellIdx, rowType, actualValue }: GetFoundationInfoCellOptions) => {
    const row = baseRowDataCy(rowType);
    const cell = baseCellDataCy(cellIdx, "cell");
    cy.get(`[data-cy=foundationInfoSection] [data-cy=${row}] [data-cy=${cell}]`).contains(
      actualValue
    );
  }
);

export interface ChangeFoundationInfoCellOptions extends GetFoundationInfoCellOptions {
  newValue: number;
}
Cypress.Commands.add(
  "changeFoundationInfoCell",
  ({ newValue, ...getCellOptions }: ChangeFoundationInfoCellOptions) => {
    cy.getFoundationInfoCell(getCellOptions).type(`${newValue}{enter}`);
  }
);
