/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as _ from "lodash";
import { shiftSectionDataCy } from "../../../../src/components/schedule/worker-info-section/worker-info-section.models";
import { ShiftCode } from "../../../../src/state/schedule-data/shifts-types/shift-types.model";
import { GetWorkerShiftOptions } from "../../../support/commands";


const prevMonthDays = 6;

interface WorkerTestCase {
  title: string;
  startShiftCell: GetWorkerShiftOptions;
  endShiftCell: GetWorkerShiftOptions;
  desiredShiftCode: ShiftCode;
}

const workerTestCases: WorkerTestCase[] = [
  {
    title: "Should be able to edit multiple days of single nurse (drag left to right)",
    startShiftCell: {
      workerGroupIdx: 0,
      workerIdx: 0,
      shiftIdx: 3,
    },
    endShiftCell: {
      workerGroupIdx: 0,
      workerIdx: 0,
      shiftIdx: 7,
    },
    desiredShiftCode: ShiftCode.L4,
  },
  {
    title: "Should be able to edit multiple days of single nurse (drag right to left)",
    startShiftCell: {
      workerGroupIdx: 0,
      workerIdx: 0,
      shiftIdx: prevMonthDays + 3,
    },
    endShiftCell: {
      workerGroupIdx: 0,
      workerIdx: 0,
      shiftIdx: prevMonthDays,
    },
    desiredShiftCode: ShiftCode.U,
  },
  {
    title: "Should be able to edit multiple single day of multiple nurses",
    startShiftCell: {
      workerGroupIdx: 0,
      workerIdx: 0,
      shiftIdx: prevMonthDays + 5,
    },
    endShiftCell: {
      workerGroupIdx: 0,
      workerIdx: 1,
      shiftIdx: prevMonthDays + 5,
    },
    desiredShiftCode: ShiftCode.L4,
  },
  {
    title: "Should be able to edit multiple days of single babysitter",
    startShiftCell: {
      workerGroupIdx: 1,
      workerIdx: 0,
      shiftIdx: 0,
    },
    endShiftCell: {
      workerGroupIdx: 1,
      workerIdx: 0,
      shiftIdx: prevMonthDays + 8,
    },
    desiredShiftCode: ShiftCode.L4,
  },
  {
    title: "Should be able to edit multiple single day of multiple babysitters",
    startShiftCell: {
      workerGroupIdx: 1,
      workerIdx: 0,
      shiftIdx: prevMonthDays + 3,
    },
    endShiftCell: {
      workerGroupIdx: 1,
      workerIdx: 1,
      shiftIdx: prevMonthDays + 6,
    },
    desiredShiftCode: ShiftCode.L4,
  },
];

enum FoundationInfoKeys {
  EXTRA_WORKERS,
  CHILDREN,
}

interface FoundationTestCase {
  title: string;
  dataKey: FoundationInfoKeys;
  startDayIdx: number;
  endDayIdx: number;
  desiredNumber: number;
}

const foundationTestCases: FoundationTestCase[] = [
  {
    title: "Should be able to edit extra workers number with range selection",
    dataKey: FoundationInfoKeys.EXTRA_WORKERS,
    startDayIdx: prevMonthDays + 3,
    endDayIdx: prevMonthDays + 8,
    desiredNumber: 10,
  },
  {
    title: "Should be able to edit children number with range selection",
    dataKey: FoundationInfoKeys.CHILDREN,
    startDayIdx: prevMonthDays + 12,
    endDayIdx: prevMonthDays + 3,
    desiredNumber: 13,
  },
];

context("Shift range selection", () => {
  beforeEach(() => {
    cy.loadScheduleToMonth("small_test_schedule.xlsx");
    cy.enterEditMode();
  });

  workerTestCases.forEach((test) => {
    it(test.title, () => {
      cy.getWorkerShift(test.startShiftCell).trigger("dragstart");
      cy.getWorkerShift(test.endShiftCell).trigger("drop");
      cy.useAutocomplete(test.desiredShiftCode);
      const groupIndx = shiftSectionDataCy(test.startShiftCell.workerGroupIdx);
      cy.get(`[data-cy=${groupIndx}] p[data-cy*="cell"]`)
        .then(($cell) => {
          return $cell
            .map((i, el) => {
              return Cypress.$(el).text();
            })
            .get();
        })
        .snapshot();
    });
  });

  foundationTestCases.forEach(({ title, dataKey, startDayIdx, endDayIdx, desiredNumber }) => {
    it(title, () => {
      cy.get(`[data-cy=foundationInfoSection]`)
        .children()
        .eq(dataKey)
        .children()
        .eq(startDayIdx)
        .trigger("dragstart");
      cy.get(`[data-cy=foundationInfoSection]`)
        .children()
        .eq(dataKey)
        .children()
        .eq(endDayIdx)
        .trigger("drop")
        .type(`${desiredNumber}{enter}`);
      for (const dayIdx of _.range(startDayIdx, endDayIdx + 1)) {
        cy.get(`[data-cy=foundationInfoSection]`)
          .children()
          .eq(dataKey)
          .children()
          .eq(dayIdx)
          .should("contain", desiredNumber);
      }
    });
  });
});
