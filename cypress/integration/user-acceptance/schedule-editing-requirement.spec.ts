/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ShiftCode } from "../../../src/common-models/shift-info.model";
import { WorkerType } from "../../../src/common-models/worker-info.model";
import { ChangeFoundationInfoCellOptions, FoundationInfoRowType } from "../../support/commands";

interface WorkerCellDescription {
  workerType: WorkerType;
  workerIdx: number;
  shiftIdx: number;
  actualShiftCode: ShiftCode;
  newShiftCode: ShiftCode;
}
const workerCells: WorkerCellDescription[] = [
  {
    workerType: WorkerType.NURSE,
    workerIdx: 0,
    shiftIdx: 6,
    actualShiftCode: ShiftCode.U,
    newShiftCode: ShiftCode.D,
  },
];

const childrenInfoCell: ChangeFoundationInfoCellOptions = {
  newValue: 1,
  actualValue: 24,
  rowType: FoundationInfoRowType.ChildrenInfoRow,
  cellIdx: 6,
};

const extraWorkerInfoCell: ChangeFoundationInfoCellOptions = {
  newValue: 10,
  actualValue: 0,
  rowType: FoundationInfoRowType.ExtraWorkersRow,
  cellIdx: 6,
};
describe("schedule editing requirement", () => {
  beforeEach(() => {
    cy.loadScheduleToMonth();
    cy.enterEditMode();
  });

  //     - umożliwia przypisanie zmian w danych dniach dla określonych **pracowników**
  it("shows how to change worker shift", () => {
    cy.getWorkerShift(workerCells[0]).click().screenshotSync();
    cy.useAutocomplete(workerCells[0].newShiftCode).screenshotSync();
    cy.getWorkerShift(workerCells[0]).contains(workerCells[0].newShiftCode).screenshotSync();
  });

  // - umożliwia zmianę liczby podopiecznych w danym dniu
  it("shows how to change children number", () => {
    cy.getFoundationInfoCell(childrenInfoCell).screenshotSync();
    cy.changeFoundationInfoCell(childrenInfoCell).screenshotSync();
  });
  // - umożliwia zmianę liczby pracowników dodatkowych w danym dniu ( bez konieczności dodawania ich za pomocą widoku zarządzania harmonogramem)
  it("shows how to change extra workers info", () => {
    cy.getFoundationInfoCell(extraWorkerInfoCell).screenshotSync();
    cy.changeFoundationInfoCell(extraWorkerInfoCell).screenshotSync();
  });

  // - umożliwia cofanie i ponawianie wykonywanych zmian w grafiku
  it("shows how to make undo in schedule", () => {
    cy.getWorkerShift(workerCells[0]).click().screenshotSync();
    cy.useAutocomplete(workerCells[0].newShiftCode).screenshotSync();
    cy.get("[data-cy=undo-button]").click({ force: true });
    cy.getWorkerShift(workerCells[0]).contains(workerCells[0].actualShiftCode).screenshotSync();
  });
});
