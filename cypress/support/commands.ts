/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import "cypress-file-upload";
import { LocalStorageProvider } from "../../src/data-access/local-storage-provider.model";
import { ShiftCode } from "../../src/utils/shift-info.model";
import {
  baseCellDataCy,
  CellType,
} from "../../src/components/schedule/base/base-cell/base-cell.models";
import { baseRowDataCy } from "../../src/components/schedule/base/base-row/base-row.models";
import { shiftSectionDataCy } from "../../src/components/schedule/worker-info-section/worker-info-section.models";
import { summaryCellDataCy } from "../../src/components/schedule/worker-info-section/summary-table/summarytable-cell.models";
import { summaryRowDataCy } from "../../src/components/schedule/worker-info-section/summary-table/summarytable-row.models";
import { summaryTableSectionDataCy } from "../../src/components/schedule/worker-info-section/summary-table/summarytable-section.models";
import { MonthHelper, NUMBER_OF_DAYS_IN_WEEK } from "../../src/helpers/month.helper";

export type CypressScreenshotOptions = Partial<
  Cypress.Loggable & Cypress.Timeoutable & Cypress.ScreenshotOptions
>;

export interface GetWorkerShiftOptions {
  workerGroupIdx: number;
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
  workerGroupIdx: number;
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
    const shiftSection = shiftSectionDataCy(0);
    cy.clock(Date.UTC(year ?? TEST_SCHEDULE_YEAR, month ?? TEST_SCHEDULE_MONTH, 15), ["Date"]);
    cy.visit(Cypress.env("baseUrl"));
    cy.get("[data-cy=file-input]").should("exist");
    cy.get("[data-cy=file-input]").attachFile(scheduleName);
    cy.get(`[data-cy=${shiftSection}]`, { timeout: 5000 }).should("exist");
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
  ({ workerGroupIdx, workerIdx, shiftIdx, selector = "cell" }: GetWorkerShiftOptions) => {
    const section = shiftSectionDataCy(workerGroupIdx);
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
  ({ workerGroupIdx, workerIdx, hoursInfo }: CheckHoursInfoOptions) => {
    const section = summaryTableSectionDataCy(workerGroupIdx);
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
  // TODO: uncomment and test on refactoring
  const actualRevisionValue = "actual";
  cy.get("[data-cy=revision-select]")
    //   .select(RevisionTypeLabels[actualRevisionValue])
    .should("have.value", actualRevisionValue);
  // cy.get("[data-cy=revision-select]").blur();
  cy.get("[data-cy=edit-mode-button]").click();
  const dataCy = shiftSectionDataCy(0);
  return cy.get(`[data-cy=${dataCy}]`).should("exist");
});

Cypress.Commands.add("leaveEditMode", () => {
  cy.get("[data-cy=leave-edit-mode]").click();
  const dataCy = shiftSectionDataCy(0);
  return cy.get(`[data-cy=${dataCy}]`).should("exist");
});

Cypress.Commands.add(
  "screenshotSync",
  (awaitTime = 100, cyScreenshotOptions?: CypressScreenshotOptions) => {
    // In case if screenshots are disabled, just return `cy`, so command is still chainable
    if (Cypress.env("makeScreenshots") !== "true") {
      return cy;
    }
    cy.get("#app-header").invoke("css", "position", "absolute");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.screenshot(cyScreenshotOptions).wait(awaitTime);
    return cy.get("#app-header").invoke("css", "position", null);
  }
);

export enum FoundationInfoRowType {
  ExtraWorkersRow = 1,
  ChildrenInfoRow = 0,
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
