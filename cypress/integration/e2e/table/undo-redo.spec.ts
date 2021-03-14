/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/// <reference path="../../../support/index.d.ts" />

import { WorkerType } from "../../../../src/common-models/worker-info.model";
import { GetWorkerShiftOptions } from "../../../support/commands";
import { ShiftCode } from "../../../../src/common-models/shift-info.model";

interface TestCase {
  testedShiftCell: GetWorkerShiftOptions;
  firstShift: ShiftCode;
  secondShift: ShiftCode;
}
const daysFromPrevMonths = 6;

const testCases: TestCase[] = [
  {
    testedShiftCell: {
      workerType: WorkerType.NURSE,
      workerIdx: 0,
      shiftIdx: daysFromPrevMonths + 9,
    },
    firstShift: ShiftCode.P,
    secondShift: ShiftCode.R,
  },
  {
    testedShiftCell: {
      workerType: WorkerType.OTHER,
      workerIdx: 3,
      shiftIdx: daysFromPrevMonths + 2,
    },
    firstShift: ShiftCode.DN,
    secondShift: ShiftCode.N,
  },
];

function performShiftChanges(testCase: TestCase): void {
  cy.changeWorkerShift({ ...testCase.testedShiftCell, newShiftCode: testCase.firstShift });
  cy.changeWorkerShift({ ...testCase.testedShiftCell, newShiftCode: testCase.secondShift });
}

context("Undo/Redo test", () => {
  before(() => {
    cy.loadScheduleToMonth();
    cy.enterEditMode();
  });

  testCases.forEach((testCase) => {
    it(`Should change worker (type: ${testCase.testedShiftCell.workerType.toLowerCase()}) shift and
       use undo and redo buttons to set proper cell state`, () => {
      performShiftChanges(testCase);

      cy.get("[data-cy=undo-button]").click();
      cy.getWorkerShift(testCase.testedShiftCell).should("contain", testCase.firstShift);

      cy.get("[data-cy=redo-button]").click();
      cy.getWorkerShift(testCase.testedShiftCell).should("contain", testCase.secondShift);
    });
  });

  testCases.forEach((testCase) => {
    it(`Should change worker (type: ${testCase.testedShiftCell.workerType.toLowerCase()}shift and
       use undo and redo shortcuts to set proper cell state`, () => {
      performShiftChanges(testCase);

      cy.get("body").type("{ctrl}{z}");
      cy.getWorkerShift(testCase.testedShiftCell).should("contain", testCase.firstShift);

      cy.get("body").type("{ctrl}{shift}{z}");
      cy.getWorkerShift(testCase.testedShiftCell).should("contain", testCase.secondShift);
    });
  });
});

context("Edit mode test", () => {
  it("Save button should be disabled when there are no changes", () => {
    const cell = {
      workerType: WorkerType.NURSE,
      workerIdx: 0,
      shiftIdx: 6,
    };
    cy.loadScheduleToMonth("example.xlsx");
    cy.checkWorkerShift({
      ...cell,
      desiredShiftCode: ShiftCode.U,
    });
    cy.enterEditMode();
    cy.get("[data-cy=save-schedule-button]").should("be.disabled");
  });
});
